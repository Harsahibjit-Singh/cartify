// src/app/api/wishlist/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Helper function to securely get the user ID from the JWT cookie
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

// ==========================================
// GET: Fetch all wishlist items for the user
// ==========================================
export async function GET() {
  try {
    const userId = await getAuthUserId();
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch wishlist items AND the associated product details
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ==========================================
// POST: Add an item to the wishlist
// ==========================================
export async function POST(request) {
  try {
    const userId = await getAuthUserId();
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Please login to add to wishlist' }, { status: 401 });
    }

    const { productId } = await request.json();

    // Insert the item. The UNIQUE(user_id, product_id) constraint in your DB 
    // prevents the same item from being added twice.
    const { error } = await supabase
      .from('wishlist')
      .insert([{ user_id: userId, product_id: productId }]);

    if (error) {
      // If it's a unique constraint violation (code 23505), just ignore it and say success
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already in wishlist' });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ==========================================
// DELETE: Remove an item from the wishlist
// ==========================================
export async function DELETE(request) {
  try {
    const userId = await getAuthUserId();
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();

    // Delete the specific product for this specific user
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}