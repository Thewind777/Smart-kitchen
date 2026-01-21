import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { ratelimit } from '@/lib/rate-limit';

// Input validation schema (Security requirement from review)
const searchSchema = z.object({
    query: z.string().min(1).max(100),
    page: z.number().int().min(1).max(100).optional().default(1),
    filters: z.object({
        keto: z.boolean().optional(),
        diabetes_safe: z.boolean().optional(),
    }).optional(),
});

const RESULTS_PER_PAGE = 50;

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        // 1. Rate Limiting (CFO requirement - prevent cost spikes)
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
        const rateLimitResult = await ratelimit.limit(ip);

        if (!rateLimitResult.success) {
            console.log('[RATE_LIMIT]', { ip, remaining: rateLimitResult.remaining });
            return NextResponse.json(
                { error: 'Rate limit exceeded. Try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                    }
                }
            );
        }

        // 2. Input Validation (Security: prevent injection)
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const ketoFilter = searchParams.get('keto') === 'true';
        const diabetesSafeFilter = searchParams.get('diabetes_safe') === 'true';

        const validation = searchSchema.safeParse({
            query,
            page,
            filters: {
                keto: ketoFilter || undefined,
                diabetes_safe: diabetesSafeFilter || undefined,
            },
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid search parameters', details: validation.error.errors },
                { status: 400 }
            );
        }

        const { query: searchQuery, page: currentPage, filters } = validation.data;

        // 3. Create Supabase client PER REQUEST (Architect requirement - RLS fix)
        // This ensures user context is properly passed for Row Level Security
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: request.headers.get('Authorization') || '',
                    },
                },
            }
        );

        // 4. Execute query with pagination (Architect requirement)
        const from = (currentPage - 1) * RESULTS_PER_PAGE;
        const to = from + RESULTS_PER_PAGE - 1;

        let dbQuery = supabase
            .from('products')
            .select('id, name, store, price, original_price, image_url', { count: 'exact' })
            .textSearch('fts', searchQuery, {
                type: 'websearch',
                config: 'english',
            })
            .range(from, to);

        const { data, error, count } = await dbQuery;

        if (error) {
            // Structured logging (QA requirement)
            console.error('[API_ERROR]', {
                endpoint: '/api/search',
                query: searchQuery,
                error: error.message,
                code: error.code,
                latency: Date.now() - startTime,
            });

            return NextResponse.json(
                { error: 'Database query failed' },
                { status: 500 }
            );
        }

        // 5. Apply client-side filters (temporary until we add DB columns)
        let results = data || [];

        if (filters?.keto) {
            results = results.filter((p) => {
                const name = p.name?.toLowerCase() || '';
                return !(name.includes('pasta') && !name.includes('keto'));
            });
        }

        if (filters?.diabetes_safe) {
            results = results.filter((p) => {
                const name = p.name?.toLowerCase() || '';
                return !(name.includes('sugar') && !name.includes('zero'));
            });
        }

        // 6. Map to standardized format
        const formattedResults = results.map((row) => ({
            id: row.id,
            name: row.name,
            brand: row.brand || 'Generic',
            store: row.store,
            price: row.price,
            original_price: row.original_price,
            image: row.image_url,
            savings:
                row.original_price && row.price
                    ? Math.round((row.original_price - row.price) * 100) / 100
                    : 0,
        }));

        // 7. Sort by price (cheapest first)
        formattedResults.sort((a, b) => a.price - b.price);

        // Structured logging (QA requirement)
        console.log('[API_SUCCESS]', {
            endpoint: '/api/search',
            query: searchQuery,
            results: formattedResults.length,
            totalCount: count,
            page: currentPage,
            latency: Date.now() - startTime,
        });

        return NextResponse.json({
            results: formattedResults,
            count: formattedResults.length,
            total: count,
            page: currentPage,
            totalPages: Math.ceil((count || 0) / RESULTS_PER_PAGE),
        });
    } catch (error) {
        // Structured logging (QA requirement)
        console.error('[API_ERROR]', {
            endpoint: '/api/search',
            error: error instanceof Error ? error.message : 'Unknown error',
            latency: Date.now() - startTime,
        });

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
