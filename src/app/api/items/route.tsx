import prisma from '@/lib/db/prisma';
import { Item } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const items = await prisma.item.findMany({
    where: { sheetId: searchParams.get('sheet') },
  });

  return NextResponse.json(items);
}

type CreateQueryParam = Partial<Omit<Item, 'id' | 'sheetId' | 'sheet'>>;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params: CreateQueryParam = await req.json();

  const item = await prisma.item.create({
    data: {
      sheet: {
        connect: { id: searchParams.get('sheet') },
        ...params,
      },
    },
  });

  return NextResponse.json(item);
}
