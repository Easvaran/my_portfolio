import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { verifyAdminPassword } from '@/lib/auth';

// POST a new contact message
export async function POST(req: Request) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return NextResponse.json({ message: 'Message sent successfully!', contact: newContact }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    console.error('POST /api/contact error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET all contact messages (protected)
export async function GET(req: Request) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }
    const { searchParams } = new URL(req.url);
    const password = searchParams.get('password');

    const isAuthorized = await verifyAdminPassword(password);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json(contacts);
  } catch (error) {
    const err = error as Error;
    console.error('GET /api/contact error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
