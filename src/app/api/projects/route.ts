import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { verifyAdminPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(Array.isArray(projects) ? projects : []);
  } catch (error) {
    const err = error as Error;
    const errorMsg = err.message || String(err);
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
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }
    
    let body;
    try {
      body = await req.json();
    } catch (parseErr) {
      console.error('Request JSON parse error:', parseErr);
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { title, description, image, tags, live, github, order, password } = body;

    const isAuthorized = await verifyAdminPassword(password);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Basic validation
    if (!title || !description || !image || !live || !github) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = await Project.create({
      title,
      description,
      image,
      tags: Array.isArray(tags) ? tags : [],
      live,
      github,
      order: order || 0,
    });

    revalidatePath('/', 'layout');

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ 
      error: 'SERVER_ERROR',
      message: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
