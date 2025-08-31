import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clinics } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Clinic name is required' }, { status: 400 });
  }
  try {
    const newClinic = await db.insert(clinics).values({ id: crypto.randomUUID(), name }).returning();
    return NextResponse.json(newClinic[0], { status: 201 });
  } catch (error) {
    console.error('Error creating clinic:', error);
    return NextResponse.json({ error: 'Failed to create clinic' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allClinics = await db.select().from(clinics);
    return NextResponse.json(allClinics, { status: 200 });
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 });
  }
}
