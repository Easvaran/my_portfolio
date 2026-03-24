import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const dbStatus = mongoose.connection.readyState === 1 ? 'ok' : 'error';

    return NextResponse.json({
      api: 'ok',
      db: dbStatus,
      env: process.env.MONGODB_URI ? 'Defined' : 'Not Defined',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ 
      api: 'ok', 
      db: 'error', 
      env: process.env.MONGODB_URI ? 'Defined' : 'Not Defined',
      timestamp: new Date().toISOString(),
      error: err.message 
    }, { status: 500 });
  }
}
