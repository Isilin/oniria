import prisma from '@/lib/db/prisma';
import { Golem } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const golems = await prisma.golem.findMany({
    where: { sheetId: searchParams.get('sheet') },
  });

  return NextResponse.json(golems);
}

type CreateQueryParam = Partial<Omit<Golem, 'id' | 'sheetId' | 'sheet'>>;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: CreateQueryParam = await req.json();

  const golem = await prisma.golem.create({
    data: {
      sheet: {
        connect: { id: searchParams.get('sheet') },
        ...params,
      },
    },
  });

  return NextResponse.json(golem);
}
