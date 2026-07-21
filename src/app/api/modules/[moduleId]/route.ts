import { NextResponse } from 'next/server';

const mockModules: Record<string, any> = {
  '1': { id: '1', title: 'Autentikasi User', type: 'featureNode', status: 'Selesai', phase: 'FASE 1' },
  '2': { id: '2', title: 'Payment Gateway', type: 'subfeatureNode', status: 'Draft', phase: 'FASE 2' },
  '3': { id: '3', title: 'Laporan Keuangan', type: 'featureNode', status: 'Draf', phase: 'MVP' }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;

  if (!moduleId || moduleId === 'undefined' || moduleId === 'null' || moduleId === '{moduleId}') {
    return NextResponse.json({ error: 'Missing or invalid module identifier' }, { status: 400 });
  }

  const moduleData = mockModules[moduleId] || {
    id: moduleId,
    title: `Modul ${moduleId}`,
    type: 'featureNode',
    status: 'Selesai',
    phase: 'FASE 1'
  };

  return NextResponse.json({ success: true, data: moduleData });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;

  if (!moduleId || moduleId === 'undefined' || moduleId === 'null' || moduleId === '{moduleId}') {
    return NextResponse.json({ error: 'Missing module identifier' }, { status: 400 });
  }

  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: { id: moduleId, ...body } });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
