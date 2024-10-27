import prisma from '@/lib/db/prisma';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const sheet = await prisma.sheet.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  return NextResponse.json(sheet);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.sheet.delete({
    where: { id: params.id },
  });

  return NextResponse.json(null, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await req.json();

  const sheet = await prisma.sheet.update({
    where: { id: params.id },
    data,
  });
  revalidateTag(`sheet-${params.id}`);
  return NextResponse.json(sheet);
}
