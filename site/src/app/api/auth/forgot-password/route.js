import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('email', email)
      .single();

    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account exists, a reset link has been sent.' 
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour from now

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        reset_token: token,
        reset_token_expiry: expiry
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${email}`;

    // THEMED HTML EMAIL TEMPLATE
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 4px;">
        <div style="background-color: #800000; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <h1 style="color: white; margin: 0; font-style: italic; letter-spacing: 1px;">Cartify</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #212121; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
          <p style="color: #212121; line-height: 1.5;">Hi ${user.name},</p>
          <p style="color: #666666; line-height: 1.5;">We received a request to reset the password for your Cartify account. Click the button below to choose a new password. This link will expire in 1 hour.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #fb641b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 2px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              RESET PASSWORD
            </a>
          </div>
          
          <p style="color: #878787; font-size: 13px; line-height: 1.5;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <div style="border-top: 1px solid #eeeeee; margin-top: 30px; pt-20px;">
            <p style="color: #878787; font-size: 11px; text-align: center; margin-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${resetUrl}" style="color: #800000;">${resetUrl}</a>
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Cartify Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your Cartify Password',
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: 'Reset link sent.' });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}