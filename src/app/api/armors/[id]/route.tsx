import prisma from '@/lib/db/prisma';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.armor.delete({
    where: { id: params.id },
  });

  return NextResponse.json(null, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await req.json();

  const armor = await prisma.armor.update({
    where: { id: params.id },
    data,
  });
  revalidateTag(`armor-${params.id}`);

  return NextResponse.json(armor);
}
