import prisma from '@/lib/db/prisma';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.rangeWeapon.delete({
    where: { id: params.id },
  });

  return NextResponse.json(null, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await req.json();

  const rangeWeapon = await prisma.rangeWeapon.update({
    where: { id: params.id },
    data,
  });
  revalidateTag(`range-weapon-${params.id}`);
  return NextResponse.json(rangeWeapon);
}
