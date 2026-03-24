import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

// POST a new contact message
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return NextResponse.json({ message: 'Message sent successfully!', contact: newContact }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/contact error:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// GET all contact messages (protected)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('GET /api/contact error:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
