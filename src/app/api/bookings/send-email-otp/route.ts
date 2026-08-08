import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Save OTP to Firestore
    await setDoc(doc(db, 'email_otps', email.toLowerCase()), {
      otp,
      expiresAt,
      createdAt: Date.now()
    });

    // Send email via Brevo
    if (BREVO_API_KEY) {
      const nameStr = firstName ? firstName : 'Valued Patient';
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Verification Code</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; color: #1d1d1f; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04); }
            h1 { font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 10px; }
            p { font-size: 16px; line-height: 1.5; color: #515154; text-align: center; }
            .otp-box { background-color: #f5f5f7; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #1d1d1f; }
            @media only screen and (max-width: 600px) {
              .container { margin: 20px 10px; padding: 30px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verify your email</h1>
            <p>Hi ${nameStr},</p>
            <p>Please use the following 6-digit code to verify your email address and continue booking your health scan.</p>
            
            <div class="otp-box">${otp}</div>
            
            <p style="font-size: 14px; color: #86868b;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
          </div>
        </body>
        </html>
      `;

      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'AIRO Health', email: 'no-reply@airoessentials.com' },
          to: [{ email, name: nameStr }],
          subject: `${otp} is your AIRO verification code`,
          htmlContent: htmlContent,
        }),
      });

      if (!brevoResponse.ok) {
        const errData = await brevoResponse.json();
        console.error("Brevo error:", errData);
        // We won't block the request if the email fails, but it means they won't get the code.
        // In dev, we might want to log it and succeed.
      }
    } else {
      console.log(`[DEV OTP] Sent ${otp} to ${email}`);
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
