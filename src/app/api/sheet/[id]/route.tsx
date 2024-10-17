import db from '@/lib/helpers/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await db.sheet.delete({
    where: { id: params.id },
  });

  return NextResponse.json(null, { status: 200 });
}
