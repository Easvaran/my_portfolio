import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visitor from '@/models/Visitor';
import Contact from '@/models/Contact';
import { verifyAdminPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get('password');

    const isAuthorized = await verifyAdminPassword(password);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get active visitors (last 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const activeVisitors = await Visitor.countDocuments({
      lastSeen: { $gte: twoMinutesAgo }
    });

    // Get client inquiries (total and pending)
    // Assuming pending messages are those from the last 24 hours or based on a 'read' flag if it exists
    const totalInquiries = await Contact.countDocuments({});
    
    // For now, let's just use total inquiries as we don't have a 'status' field in the Contact model yet
    // We can simulate pending inquiries as those from the last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const pendingInquiries = await Contact.countDocuments({
      createdAt: { $gte: twentyFourHoursAgo }
    });

    return NextResponse.json({
      activeVisitors,
      inquiries: {
        total: totalInquiries,
        pending: pendingInquiries
      }
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
