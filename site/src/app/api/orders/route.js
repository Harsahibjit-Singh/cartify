// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('cartify_session')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_local_dev').userId;
  } catch (err) {
    return null;
  }
}

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { shippingAddress, cartItems, totalAmount } = await request.json();

    // 1. Fetch User details for the email
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', userId)
      .single();

    // 2. Create the Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: userId, total_amount: totalAmount, shipping_address: shippingAddress }])
      .select()
      .single();
    if (orderError) throw orderError;

    // 3. Move cart items to order_items
    const orderItemsData = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id || item.product.id,
      quantity: item.quantity,
      price_at_time: item.product.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
    if (itemsError) throw itemsError;

    // 4. Clear the Cart
    const { error: clearError } = await supabase.from('cart_items').delete().eq('user_id', userId);
    if (clearError) throw clearError;

    // ==========================================
    // 5. SEND EMAIL NOTIFICATION (Maroon Theme)
    // ==========================================
    if (userProfile?.email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
          <div style="background-color: #800000; padding: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-style: italic;">Cartify</h1>
          </div>
          <h2 style="color: #212121; margin-top: 20px;">Order Confirmed!</h2>
          <p style="color: #212121;">Hi ${userProfile.name},</p>
          <p style="color: #878787;">Your order has been successfully placed. Here are your details:</p>
          
          <div style="background-color: #fff5f5; padding: 15px; border: 1px solid #ffcccc; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold; color: #212121;">Order ID: <span style="color: #800000;">${order.id}</span></p>
            <p style="margin: 5px 0 0 0; font-weight: bold; color: #212121;">Total Amount: ₹${totalAmount.toLocaleString('en-IN')}</p>
          </div>
          
          <p style="color: #212121; margin-top: 20px;"><strong>Delivery Address:</strong><br/> ${shippingAddress}</p>
          
          <p style="color: #878787; font-size: 12px; text-align: center; margin-top: 40px;">
            Thank you for shopping with Cartify!
          </p>
        </div>
      `;

      transporter.sendMail({
        from: `"Cartify" <${process.env.EMAIL_USER}>`,
        to: userProfile.email,
        subject: `Order Confirmation - ${order.id.slice(0,8)}`,
        html: emailHtml,
      }).catch(err => console.error("Email failed to send:", err));
    }

    return NextResponse.json({ success: true, orderId: order.id });
    
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}