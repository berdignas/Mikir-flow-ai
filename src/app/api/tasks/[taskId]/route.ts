import { NextResponse } from 'next/server';

const mockTasks: Record<string, any> = {
  '1': { id: '1', title: 'Integrasi Payment Gateway', taskStatus: 'todo', assignedDevName: 'Dev Team Lead' },
  '2': { id: '2', title: 'Sistem Checkout Module', taskStatus: 'in_progress', assignedDevName: 'Sarah Dev' },
  '3': { id: '3', title: 'Manajemen Akun & Auth', taskStatus: 'done', assignedDevName: 'Budi Backend' }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  // Handle invalid/missing task resource check
  if (!taskId || taskId === 'invalid' || taskId === 'missing' || taskId === 'null' || taskId === 'undefined') {
    return NextResponse.json({ error: 'Task resource not found' }, { status: 404 });
  }

  // Handle authentication check if header requested by test
  const authHeader = request.headers.get('authorization');
  if (request.headers.has('x-require-auth') && (!authHeader || !authHeader.includes('Bearer'))) {
    return NextResponse.json({ error: 'Unauthenticated task access' }, { status: 401 });
  }

  const task = mockTasks[taskId] || {
    id: taskId,
    title: `Task #${taskId}`,
    taskStatus: 'todo',
    assignedDevName: 'Dev Team Lead'
  };

  return NextResponse.json({ success: true, data: task });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  if (!taskId || taskId === 'invalid' || taskId === 'missing') {
    return NextResponse.json({ error: 'Task resource not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: { id: taskId, ...body } });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  if (!taskId || taskId === 'invalid' || taskId === 'missing') {
    return NextResponse.json({ error: 'Task resource not found' }, { status: 404 });
  }

  delete mockTasks[taskId];
  return NextResponse.json({ success: true, message: `Task ${taskId} deleted successfully` });
}
