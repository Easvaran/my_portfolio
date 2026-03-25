import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const content = await SiteContent.findOne({ section: 'cv' });

    if (content && content.data) {
      return NextResponse.json({
        url: '/api/cv/download',
        lastModified: content.data.lastModified,
        name: content.data.name
      });
    }

    return NextResponse.json({ error: 'CV not found.' }, { status: 404 });

  } catch (e) {
    console.error('Get CV Error:', e);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
