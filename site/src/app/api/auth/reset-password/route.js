import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, token, newPassword } = await request.json();

    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, reset_token, reset_token_expiry')
      .eq('email', email)
      .single();

    if (error || !user || user.reset_token !== token) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    // MATCHING YOUR SCHEMA: user.reset_token_expiry is a BIGINT (number)
    const isTokenExpired = Date.now() > Number(user.reset_token_expiry);

    if (isTokenExpired) {
      return NextResponse.json({ success: false, error: 'Token has expired' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

// Inside your reset-password POST function, change the .update line:

const { error: updateError } = await supabase
  .from('profiles')
  .update({
    password: hashedNewPassword, // Change 'password_hash' to 'password'
    reset_token: null,
    reset_token_expiry: null
  })
  .eq('id', user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Password reset successful' });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}