import { NextResponse } from 'next/server';
import { db } from '@/db';
import { patients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { clinicId, name, age, contact } = await req.json();
  if (!clinicId || !name) {
    return NextResponse.json({ error: 'Clinic ID and patient name are required' }, { status: 400 });
  }
  try {
    const newPatient = await db.insert(patients).values({ id: crypto.randomUUID(), clinicId, name, age, contact }).returning();
    return NextResponse.json(newPatient[0], { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get('clinicId');

  if (!clinicId) {
    return NextResponse.json({ error: 'Clinic ID is required' }, { status: 400 });
  }

  try {
    const clinicPatients = await db.select().from(patients).where(eq(patients.clinicId, clinicId));
    return NextResponse.json(clinicPatients, { status: 200 });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}
