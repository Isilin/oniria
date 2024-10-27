import { auth } from '@/app/auth';
import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  const sheets = await prisma.sheet.findMany({
    where: { userId: session?.user.id },
  });

  return NextResponse.json(sheets);
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
