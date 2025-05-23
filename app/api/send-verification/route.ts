import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Log environment status (without exposing the actual key)
console.log('Environment:', {
  nodeEnv: process.env.NODE_ENV,
  hasResendKey: !!process.env.RESEND_API_KEY,
  keyLength: process.env.RESEND_API_KEY?.length || 0
});

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not defined in environment variables');
  throw new Error('Email service configuration is missing');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    console.log('Attempting to send verification email to:', email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Structure <onboarding@resend.dev>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for using Structure. Please use the following code to verify your email address:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; margin: 0; font-size: 32px;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this verification code, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', {
        error,
        environment: process.env.NODE_ENV,
        hasKey: !!process.env.RESEND_API_KEY
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to send verification email', 
          details: error,
          environment: isProduction ? 'production' : 'development'
        },
        { status: 500 }
      );
    }

    console.log('Verification email sent successfully');
    return NextResponse.json({ 
      success: true, 
      data,
      environment: isProduction ? 'production' : 'development'
    });
  } catch (error) {
    console.error('Error sending verification email:', {
      error,
      environment: process.env.NODE_ENV,
      hasKey: !!process.env.RESEND_API_KEY
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: isProduction ? 'production' : 'development'
      },
      { status: 500 }
    );
  }
} 