import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: { members: true },
  });
  return NextResponse.json(team);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.team.delete({
    where: { id: params.id },
  });

  return NextResponse.json(null, { status: 200 });
}
