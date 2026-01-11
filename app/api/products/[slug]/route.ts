import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/product'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 404 })
    }

    // Fetch variants
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      ...product,
      variants: variants || [],
    } as Product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

