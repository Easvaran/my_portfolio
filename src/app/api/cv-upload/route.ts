import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Only PDF is allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicPath = join(process.cwd(), 'public');
    const cvPath = join(publicPath, 'cv.pdf');

    await writeFile(cvPath, buffer);

    revalidatePath('/', 'layout');

    return NextResponse.json({ message: 'CV uploaded successfully!', path: '/cv.pdf' });

  } catch (error) {
    console.error('CV Upload Error:', error);
    return NextResponse.json({ error: 'Something went wrong during the file upload.' }, { status: 500 });
  }
}
