import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.whitelist.delete({
    where: { id: params.id },
  });

  return NextResponse.json(null, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await req.json();

  await prisma.whitelist.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(null, { status: 200 });
}
