import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const content = await SiteContent.findOne({ section: 'cv' });
    
    if (content && content.data && content.data.pdf) {
      const base64Data = content.data.pdf;
      
      // Handle data URL format: data:application/pdf;base64,xxxx
      const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      
      if (match) {
        const contentType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': 'inline; filename="resume.pdf"',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }
    
    return NextResponse.json({ error: 'CV not found.' }, { status: 404 });
  } catch (error) {
    console.error('Download CV Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
