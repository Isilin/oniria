import prisma from '@/lib/db/prisma';
import { Spell } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const spells = await prisma.spell.findMany({
    where: { sheetId: searchParams.get('sheet') },
  });

  return NextResponse.json(spells);
}

type CreateQueryParam = Partial<Omit<Spell, 'id' | 'sheetId' | 'sheet'>>;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: CreateQueryParam = await req.json();

  const spell = await prisma.spell.create({
    data: {
      sheet: {
        connect: { id: searchParams.get('sheet') },
        ...params,
      },
    },
  });

  return NextResponse.json(spell);
}
