// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  // Await the cookies object to comply with Next.js 15+ dynamic API rules
  const cookieStore = await cookies();
  const token = cookieStore.get('cartify_session')?.value;

  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret_for_local_dev'
    );
    return NextResponse.json({ success: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
}