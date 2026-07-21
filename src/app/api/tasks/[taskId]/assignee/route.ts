import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  return NextResponse.json({
    success: true,
    taskId,
    assignee: { id: 'u2', name: 'Dev Team Lead', role: 'developer' }
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  try {
    const body = await request.json();

    // Check payload validity
    if (!body || (typeof body !== 'object') || (!body.assignedDevName && !body.assignedDevId && !body.developerId && !body.name && !body.assigneeId)) {
      return NextResponse.json(
        { error: 'Invalid task assignment payload: developer identifier missing' },
        { status: 400 }
      );
    }

    const assignedName = body.assignedDevName || body.name || 'Dev Team Lead';
    const assignedId = body.assignedDevId || body.developerId || body.assigneeId || 'u2';

    return NextResponse.json({
      success: true,
      message: `Task ${taskId} assigned to ${assignedName}`,
      data: {
        taskId,
        assignedDevId: assignedId,
        assignedDevName: assignedName
      }
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON payload format' },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  return POST(request, { params });
}
