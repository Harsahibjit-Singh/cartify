import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    // 1. Await and extract the ID
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 2. UUID VALIDATION (The Fix)
    // This regex checks for the standard 8-4-4-4-12 hex format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(id)) {
      // If the ID is malformed (like "uuid...khbjnlkm"), return a 404 immediately
      return NextResponse.json(
        { success: false, error: 'Product not available' }, 
        { status: 404 }
      );
    }

    // 3. Query the Database
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    // 4. Handle missing data or DB errors
    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Product not available' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    // 5. Catch-all for any other unexpected issues
    console.error("PRODUCT_FETCH_ERROR:", error.message);
    return NextResponse.json(
      { success: false, error: 'Product not available' }, 
      { status: 404 }
    );
  }
}