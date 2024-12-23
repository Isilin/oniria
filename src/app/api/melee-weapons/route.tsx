import prisma from '@/lib/db/prisma';
import { MeleeWeapon } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const meleeWeapons = await prisma.meleeWeapon.findMany({
    where: { sheetId: searchParams.get('sheet') },
    include: {
      properties: true,
    },
  });

  return NextResponse.json(meleeWeapons);
}

type CreateQueryParam = Partial<Omit<MeleeWeapon, 'id' | 'sheetId' | 'sheet'>>;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: CreateQueryParam = await req.json();

  const weapon = await prisma.meleeWeapon.create({
    data: {
      sheet: {
        connect: { id: searchParams.get('sheet') },
        ...params,
      },
    },
  });

  return NextResponse.json(weapon);
}
