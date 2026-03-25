import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import Admin from '@/models/Admin';
import { sendPasswordChangedNotification } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    await connectDB();

    // Verify OTP
    const storedOTP = await OTP.findOne({ email: trimmedEmail, otp });

    if (!storedOTP) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // OTP is valid, update admin password in DB
    await Admin.findOneAndUpdate(
      { email: trimmedEmail },
      { email: trimmedEmail, password: newPassword },
      { upsert: true, new: true }
    );

    // Delete used OTP
    await OTP.deleteOne({ email: trimmedEmail, otp });

    // Send confirmation email
    await sendPasswordChangedNotification(trimmedEmail);

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    const err = error as Error;
    console.error('Verify OTP error:', err.message);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
