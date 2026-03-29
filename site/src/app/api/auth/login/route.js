import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Find user by email ONLY
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, email, name, password')
      .eq('email', email)
      .single();

    if (!user || error) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // 2. Compare the plain-text password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name }, 
      process.env.JWT_SECRET || 'fallback_secret_for_local_dev', 
      { expiresIn: '7d' }
    );

    // 4. Send response and set HTTP-only cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged in successfully', 
      user: { id: user.id, name: user.name, email: user.email } 
    });
    
    response.cookies.set({
      name: 'cartify_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}