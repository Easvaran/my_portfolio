import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();

    // 1. Check database first (for users added/edited via settings)
    const admin = await Admin.findOne({ email, password });
    if (admin) {
      return NextResponse.json({ success: true, password });
    }

    // 2. Fallback to environment variables
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;
    if (email === envEmail && password === envPassword) {
      return NextResponse.json({ success: true, password });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    const err = error as Error;
    console.error('Admin login error:', err.message);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
