import { auth } from '@/app/auth';
import { db } from '@/lib/helpers/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  const sheets = await db.sheet.findMany({
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

  const sheet = await db.sheet.create({
    data: {
      user: { connect: { id: params.userId } },
      name: params.name,
    },
  });

  return NextResponse.json(sheet);
}
