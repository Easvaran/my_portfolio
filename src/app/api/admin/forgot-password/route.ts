import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import Admin from '@/models/Admin';
import { sendOTP } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Check if email exists in database OR matches fallback admin email in .env.local
    const adminEmailEnv = process.env.ADMIN_EMAIL;
    const adminInDB = await Admin.findOne({ email });
    
    if (email !== adminEmailEnv && !adminInDB) {
      return NextResponse.json({ error: 'No admin account found with this email' }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database (it will expire in 10 minutes)
    await OTP.findOneAndUpdate(
      { email },
      { email, otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send OTP via SMTP
    const sent = await sendOTP(email, otp);

    if (sent) {
      return NextResponse.json({ message: 'OTP sent successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
  } catch (error) {
    const err = error as Error;
    console.error('Forgot password error:', err.message);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
