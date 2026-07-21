import { NextResponse } from 'next/server';

let currentRole = 'pm';

export async function GET() {
  return NextResponse.json({ role: currentRole, success: true });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }
    currentRole = body.role;
    return NextResponse.json({ role: currentRole, success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
