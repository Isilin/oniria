import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const sheet = await prisma.sheet.findUnique({
    where: { id: params.id },
    include: {
      corpus: true,
      spyree: {
        include: {
          potential: { include: { type: { include: { category: true } } } },
        },
      },
      amee: true,
    },
  });

  return NextResponse.json({
    corpus: sheet.corpus,
    spyree: sheet.spyree,
    amee: sheet.amee,
  });
}
