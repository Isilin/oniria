import prisma from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const teams = await prisma.team.findMany({
    include: { members: true },
  });

  return NextResponse.json(teams);
}

type CreateQueryParam = {
  name: string;
};

export async function POST(req: NextRequest) {
  const params: CreateQueryParam = await req.json();

  const team = await prisma.team.create({ data: { name: params.name } });

  return NextResponse.json(team);
}
