import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Directory creation failed:", err);
    }

    const filePath = path.join(uploadDir, filename);
    
    try {
      await writeFile(filePath, buffer);
      return NextResponse.json({ url: "/uploads/" + filename }, { status: 201 });
    } catch (writeErr: any) {
      console.error("Write file error:", writeErr);
      if (writeErr.code === 'EROFS' || writeErr.message.includes('read-only')) {
        return NextResponse.json({ 
          error: "Vercel's filesystem is read-only. For production, please use the 'Paste URL' option instead or set up a cloud storage service like Vercel Blob or Cloudinary." 
        }, { status: 500 });
      }
      throw writeErr;
    }
  } catch (error: any) {
    console.error("Upload process error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
