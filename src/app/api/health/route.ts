import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = {
    api: 'ok',
    db: 'unknown',
    mongodb_uri: process.env.MONGODB_URI ? 'Defined' : 'Missing',
    timestamp: new Date().toISOString(),
  };

  try {
    await connectDB();
    const dbStatus = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    status.db = states[dbStatus] || 'unknown';
    
    return NextResponse.json(status);
  } catch (error: any) {
    status.db = 'error';
    return NextResponse.json({
      ...status,
      error: error.message || String(error),
    }, { status: 500 });
  }
}
