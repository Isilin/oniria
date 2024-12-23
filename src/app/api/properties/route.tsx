import prisma from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const properties = await prisma.property.findMany();

  return NextResponse.json(properties);
}
