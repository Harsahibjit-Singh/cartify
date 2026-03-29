import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Check if user already exists
    // FIX: Used .maybeSingle() so it doesn't crash when a new user signs up
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle(); 

    if (checkError) throw checkError;

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save to database with the hashed password
    const { data: newUser, error: insertError } = await supabase
      .from('profiles')
      .insert([{ name, email, password: hashedPassword }])
      .select('id, name, email')
      .single(); // .single() is fine here because an insert SHOULD return 1 row

    if (insertError) {
      console.error("Error inserting user:", insertError);
      throw insertError;
    }

    return NextResponse.json({ success: true, message: 'Account created successfully', user: newUser });
    
  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}