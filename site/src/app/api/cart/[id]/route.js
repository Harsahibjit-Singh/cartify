import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE: Remove item from cart
export async function DELETE(request, { params }) {
  try {
    const { id } = params; // This is the cart_item ID

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Item removed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}