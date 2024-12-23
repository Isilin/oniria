import prisma from '@/lib/db/prisma';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.meleeWeapon.delete({
    where: { id: params.id },
  });

  return NextResponse.json(null, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await req.json();

  const meleeWeapon = await prisma.meleeWeapon.update({
    where: { id: params.id },
    data,
  });
  revalidateTag(`melee-weapon-${params.id}`);
  return NextResponse.json(meleeWeapon);
}
