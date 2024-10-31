import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; memberId: string } },
) {
  const team = await prisma.team.update({
    data: {
      members: {
        disconnect: [{ id: params.memberId }],
      },
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json(team);
}
