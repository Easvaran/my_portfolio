import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { verifyAdminPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('GET /api/projects - start');
    await connectDB();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(Array.isArray(projects) ? projects : []);
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    console.error('GET /api/projects error:', errorMsg);
    return NextResponse.json({ 
      error: 'DATABASE_ERROR',
      message: errorMsg,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, image, tags, live, github, order, password } = body;

    const isAuthorized = await verifyAdminPassword(password);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const project = await Project.create({
      title,
      description,
      image,
      tags,
      live,
      github,
      order: order || 0,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/projects error:', error.message);
    return NextResponse.json({ 
      error: 'CREATE_ERROR',
      message: error.message || 'Unknown error' 
    }, { status: 500 });
  }
}
