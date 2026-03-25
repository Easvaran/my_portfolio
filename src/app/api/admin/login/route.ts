import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    await connectDB();

    // 1. Check database first (case-insensitive email)
    const admin = await Admin.findOne({ 
      email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') }, 
      password: trimmedPassword 
    });
    
    if (admin) {
      return NextResponse.json({ success: true, password: admin.password });
    }

    // 2. Fallback to environment variables (case-insensitive email)
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;
    
    if (envEmail && envPassword) {
      if (trimmedEmail.toLowerCase() === envEmail.toLowerCase() && trimmedPassword === envPassword) {
        return NextResponse.json({ success: true, password: envPassword });
      }
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    const err = error as Error;
    console.error('Admin login error:', err.message);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
