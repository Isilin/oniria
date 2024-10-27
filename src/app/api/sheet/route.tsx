import { auth } from '@/app/auth';
import prisma from '@/lib/db/prisma';
import { SheetWithUser } from '@/lib/db/sheet';
import { NextRequest, NextResponse } from 'next/server';

export interface SheetGetResult {
  own: SheetWithUser[];
  others: SheetWithUser[];
}

export async function GET(): Promise<NextResponse<SheetGetResult>> {
  const session = await auth();

  const sheets: SheetWithUser[] = await prisma.sheet.findMany({
    where: { userId: session?.user.id },
    include: { user: true },
  });

  const others: SheetWithUser[] = await prisma.sheet.findMany({
    where: {
      userId: {
        not: session?.user.id,
      },
    },
    include: { user: true },
  });

  return NextResponse.json({
    own: sheets,
    others,
  });
}

type CreateQueryParam = {
  name: string;
  userId: string;
};

export async function POST(req: NextRequest) {
  const params: CreateQueryParam = await req.json();

  const sheet = await prisma.sheet.create({
    data: {
      user: { connect: { id: params.userId } },
      name: params.name,
    },
  });

  return NextResponse.json(sheet);
}
