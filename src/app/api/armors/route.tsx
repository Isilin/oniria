import prisma from '@/lib/db/prisma';
import { Armor } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const armors = await prisma.armor.findMany({
    where: { sheetId: searchParams.get('sheet') },
    include: {
      properties: true,
    },
  });

  return NextResponse.json(armors);
}

type CreateQueryParam = Partial<Omit<Armor, 'id' | 'sheetId' | 'sheet'>>;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: CreateQueryParam = await req.json();

  const armor = await prisma.armor.create({
    data: {
      sheet: {
        connect: { id: searchParams.get('sheet') },
        ...params,
      },
    },
  });

  return NextResponse.json(armor);
}
