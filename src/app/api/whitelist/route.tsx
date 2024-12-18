import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const whitelist = await prisma.whitelist.findMany();

  return NextResponse.json(whitelist);
}

type CreateQueryParam = {
  email: string;
};

export async function POST(req: NextRequest) {
  const params: CreateQueryParam = await req.json();

  const sheet = await prisma.whitelist.create({
    data: { email: params.email },
  });

  return NextResponse.json(sheet);
}
