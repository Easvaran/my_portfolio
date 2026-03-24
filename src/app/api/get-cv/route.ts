import { NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const publicPath = join(process.cwd(), 'public');
    const cvPath = join(publicPath, 'cv.pdf');

    const stats = await stat(cvPath);

    return NextResponse.json({
      url: '/cv.pdf',
      lastModified: stats.mtime,
    });

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'CV not found.' }, { status: 404 });
    }
    console.error('Get CV Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
