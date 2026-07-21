import { NextResponse } from 'next/server';

const prdDocument = {
  id: 'prd-pt-javas',
  title: 'PRD Document - PT Javas',
  content: 'Sistem Mapping Fitur & Alur Aplikasi PT Javas dengan Mikir Flow AI',
  feedbackList: [] as Array<{ id: string; comment: string; createdAt: string }>
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: prdDocument
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const comment = body?.feedback || body?.comment;

    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
      return NextResponse.json(
        { error: 'Feedback content cannot be empty' },
        { status: 400 }
      );
    }

    const newFeedback = {
      id: `fb-${Date.now()}`,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    prdDocument.feedbackList.push(newFeedback);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON body or missing feedback parameter' },
      { status: 400 }
    );
  }
}
