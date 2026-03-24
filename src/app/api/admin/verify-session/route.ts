import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const isAuthorized = await verifyAdminPassword(password);
    
    if (isAuthorized) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
