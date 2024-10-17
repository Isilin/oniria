import { db } from '@/lib/helpers/db';
import { NextResponse } from 'next/server';

export async function POST() {
  const sheet = await db.whitelist.create({ data: { email: '' } });

  return NextResponse.json(sheet);
}
