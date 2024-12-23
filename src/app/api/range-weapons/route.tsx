import prisma from '@/lib/db/prisma';
import { RangeWeapon } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rangeWeapons = await prisma.rangeWeapon.findMany({
    where: { sheetId: searchParams.get('sheet') },
    include: {
      properties: true,
    },
  });

  return NextResponse.json(rangeWeapons);
}

type CreateQueryParam = Partial<Omit<RangeWeapon, 'id' | 'sheetId' | 'sheet'>>;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: CreateQueryParam = await req.json();

  const weapon = await prisma.rangeWeapon.create({
    data: {
      sheet: {
        connect: { id: searchParams.get('sheet') },
        ...params,
      },
    },
  });

  return NextResponse.json(weapon);
}
