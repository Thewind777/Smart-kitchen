import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ratelimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
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

        // 2. Create Supabase client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 3. Fetch top deals (products with discounts)
        const { data: deals, error } = await supabase
            .from('products')
            .select('id, name, store, price, original_price, image_url')
            .not('original_price', 'is', null)
            .gt('original_price', supabase.ref('price'))
            .order('original_price', { ascending: false })
            .limit(10);

        if (error) {
            console.error('[API_ERROR]', {
                endpoint: '/api/deals',
                error: error.message,
                latency: Date.now() - startTime,
            });

            return NextResponse.json(
                { error: 'Failed to fetch deals' },
                { status: 500 }
            );
        }

        // 4. Format deals with savings calculation
        const formattedDeals = (deals || [])
            .map((product) => ({
                id: product.id,
                name: product.name,
                brand: product.brand || 'Generic',
                store: product.store,
                price: product.price,
                originalPrice: product.original_price,
                image: product.image_url || `https://foodish-api.com/images/pizza/pizza${Math.floor(Math.random() * 10) + 1}.jpg`,
                savings: Math.round((product.original_price - product.price) * 100) / 100,
                savingsPercent: Math.round(((product.original_price - product.price) / product.original_price) * 100),
            }))
            .filter((d) => d.savings > 0)
            .sort((a, b) => b.savings - a.savings);

        console.log('[API_SUCCESS]', {
            endpoint: '/api/deals',
            count: formattedDeals.length,
            latency: Date.now() - startTime,
        });

        return NextResponse.json({
            deals: formattedDeals,
            count: formattedDeals.length,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[API_ERROR]', {
            endpoint: '/api/deals',
            error: error instanceof Error ? error.message : 'Unknown error',
            latency: Date.now() - startTime,
        });

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
