import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visitor from '@/models/Visitor';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Get basic client info (optional, just for distinguishing sessions)
    const ua = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Create or update visitor heartbeat
    // We use UA and IP as a simple identifier for now
    await Visitor.findOneAndUpdate(
      { userAgent: ua, ip: ip.split(',')[0] },
      { lastSeen: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
