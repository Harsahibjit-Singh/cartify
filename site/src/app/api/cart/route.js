import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// 1. Helper to verify the token and get the REAL User ID
async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('cartify_session')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_local_dev');
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId); // Matches the logged-in user

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // FIX: Get the actual logged-in user ID, not the guest ID
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Please login to add items' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    // Check if item exists in cart for THIS specific user
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle(); // Use maybeSingle to avoid errors if not found

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity }])
        .select();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}