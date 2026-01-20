import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Input validation schema (Security requirement from review)
const searchSchema = z.object({
    query: z.string().min(1).max(100),
    filters: z.object({
        keto: z.boolean().optional(),
        diabetes_safe: z.boolean().optional(),
    }).optional(),
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query');
        const ketoFilter = searchParams.get('keto') === 'true';
        const diabetesSafeFilter = searchParams.get('diabetes_safe') === 'true';

        // Validate input (Security: prevent injection)
        const validation = searchSchema.safeParse({
            query,
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

        const { query: searchQuery, filters } = validation.data;

        // Use Postgres Full Text Search (Data Engineer requirement)
        // We search using textSearch for the fts column we created in setup_search_index.sql
        let dbQuery = supabase
            .from('products')
            .select('id, name, brand, store, price, original_price, image_url')
            .textSearch('fts', searchQuery, {
                type: 'websearch',
                config: 'english',
            });

        // Execute query
        const { data, error } = await dbQuery;

        if (error) {
            console.error('Supabase query error:', error);
            return NextResponse.json(
                { error: 'Database query failed' },
                { status: 500 }
            );
        }

        // Apply client-side filters (temporary until we add DB columns)
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

        // Map to standardized format
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

        // Sort by price (cheapest first)
        formattedResults.sort((a, b) => a.price - b.price);

        return NextResponse.json({
            results: formattedResults,
            count: formattedResults.length,
        });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
