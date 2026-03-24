import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

export async function GET() {
  try {
    await connectDB();
    const content = await SiteContent.findOne({ section: 'branding' });
    
    if (content && content.data && content.data.logo) {
      const base64Data = content.data.logo;
      
      // Handle data URL format: data:image/png;base64,xxxx
      const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      
      if (match) {
        const contentType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
          },
        });
      }
    }
    
    // Fallback to default favicon if no custom logo is found
    return NextResponse.redirect(new URL('/favicon.ico', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Dynamic favicon error:', error);
    return NextResponse.redirect(new URL('/favicon.ico', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }
}
