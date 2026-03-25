import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';
import { verifyAdminPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const password = data.get('password') as string;

    const isAuthorized = await verifyAdminPassword(password);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Only PDF is allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Data}`;

    await connectDB();
    await SiteContent.findOneAndUpdate(
      { section: 'cv' },
      { 
        data: { 
          pdf: dataUrl,
          name: file.name,
          lastModified: new Date().toISOString()
        } 
      },
      { upsert: true, new: true }
    );

    revalidatePath('/', 'layout');

    return NextResponse.json({ message: 'CV uploaded successfully!', path: '/api/cv/download' });

  } catch (error) {
    console.error('CV Upload Error:', error);
    return NextResponse.json({ error: 'Something went wrong during the file upload.' }, { status: 500 });
  }
}
