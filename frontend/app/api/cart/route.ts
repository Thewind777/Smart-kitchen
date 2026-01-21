import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { ratelimit } from '@/lib/rate-limit';

// Input validation schema
const cartSchema = z.object({
    items: z.array(z.string().min(1).max(100)).min(1).max(50),
});

interface StoreGroup {
    store: string;
    total: number;
    items: Array<{
        name: string;
        price: number;
        originalQuery: string;
    }>;
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // 1. Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimitResult = await ratelimit.limit(ip);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429 }
            );
        }

        // 2. Parse and validate input
        const body = await request.json();
        const validation = cartSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid cart items', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { items } = validation.data;

        // 3. Create Supabase client per request
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 4. For each item, find cheapest option across all stores
        const optimizedItems: Array<{
            query: string;
            name: string;
            price: number;
            store: string;
            found: boolean;
        }> = [];

        for (const item of items) {
            const searchTerm = item.trim();

            // Search for product using text search
            const { data: products } = await supabase
                .from('products')
                .select('id, name, price, store')
                .textSearch('fts', searchTerm, { type: 'websearch', config: 'english' })
                .order('price', { ascending: true })
                .limit(1);

            if (products && products.length > 0) {
                const cheapest = products[0];
                optimizedItems.push({
                    query: searchTerm,
                    name: cheapest.name,
                    price: cheapest.price,
                    store: cheapest.store,
                    found: true,
                });
            } else {
                // Item not found - still include in response for user feedback
                optimizedItems.push({
                    query: searchTerm,
                    name: searchTerm,
                    price: 0,
                    store: 'Not Found',
                    found: false,
                });
            }
        }

        // 5. Group by store
        const storeGroups: Record<string, StoreGroup> = {};

        optimizedItems
            .filter((item) => item.found)
            .forEach((item) => {
                if (!storeGroups[item.store]) {
                    storeGroups[item.store] = {
                        store: item.store,
                        total: 0,
                        items: [],
                    };
                }

                storeGroups[item.store].total += item.price;
                storeGroups[item.store].items.push({
                    name: item.name,
                    price: item.price,
                    originalQuery: item.query,
                });
            });

        // 6. Calculate savings
        const stores = Object.values(storeGroups);
        const totalOptimized = stores.reduce((sum, s) => sum + s.total, 0);

        // Estimate what it would cost if bought at first available store (naive baseline)
        const firstStoreEstimate = optimizedItems
            .filter((i) => i.found)
            .reduce((sum, i) => sum + i.price * 1.15, 0); // 15% markup assumption

        const savings = Math.max(0, firstStoreEstimate - totalOptimized);

        // Structured logging
        console.log('[API_SUCCESS]', {
            endpoint: '/api/cart',
            itemsRequested: items.length,
            itemsFound: optimizedItems.filter((i) => i.found).length,
            stores: stores.length,
            savings: Math.round(savings * 100) / 100,
            latency: Date.now() - startTime,
        });

        return NextResponse.json({
            saved: Math.round(savings * 100) / 100,
            total_original: Math.round(firstStoreEstimate * 100) / 100,
            total_optimized: Math.round(totalOptimized * 100) / 100,
            stores: stores.map((s) => ({
                ...s,
                total: Math.round(s.total * 100) / 100,
            })),
            notFound: optimizedItems.filter((i) => !i.found).map((i) => i.query),
        });
    } catch (error) {
        console.error('[API_ERROR]', {
            endpoint: '/api/cart',
            error: error instanceof Error ? error.message : 'Unknown error',
            latency: Date.now() - startTime,
        });

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
