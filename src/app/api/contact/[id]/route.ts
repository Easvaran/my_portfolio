import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, message, password } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, email, message },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(updatedContact);
  } catch (error: any) {
    console.error('PUT /api/contact/[id] error:', error.message);
    return NextResponse.json({ 
      error: 'UPDATE_ERROR',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message deleted' });
  } catch (error: any) {
    console.error('DELETE /api/contact/[id] error:', error.message);
    return NextResponse.json({ 
      error: 'DELETE_ERROR',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
