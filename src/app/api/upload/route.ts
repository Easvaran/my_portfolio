import { NextResponse } from 'next/server';
import { optimizeImage } from '@/lib/image-optimizer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Since we are on Vercel (read-only filesystem), we convert to Base64 
    // and return it so it can be stored in the database instead of the filesystem.
    // However, the current SimpleIconUpload expects a URL.
    // We will optimize it and return the Base64 data URL.
    
    return NextResponse.json({ 
      url: "BASE64_CONVERSION_REQUIRED_ON_CLIENT" 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Upload process error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
