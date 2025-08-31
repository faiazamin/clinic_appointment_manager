import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments } from '@/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function POST(req: Request) {
  const { clinicId, patientId, date, reason } = await req.json();
  if (!clinicId || !patientId || !date) {
    return NextResponse.json({ error: 'Clinic ID, Patient ID, and date are required' }, { status: 400 });
  }
  try {
    const newAppointment = await db.insert(appointments).values({ id: crypto.randomUUID(), clinicId, patientId, date, reason }).returning();
    return NextResponse.json(newAppointment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get('clinicId');
  const upcoming = searchParams.get('upcoming');

  if (!clinicId) {
    return NextResponse.json({ error: 'Clinic ID is required' }, { status: 400 });
  }

  try {
    let clinicAppointments;
    if (upcoming === 'true') {
      const today = new Date().toISOString().split('T')[0];
      clinicAppointments = await db.select().from(appointments).where(and(eq(appointments.clinicId, clinicId), gte(appointments.date, today)));
    } else {
      clinicAppointments = await db.select().from(appointments).where(eq(appointments.clinicId, clinicId));
    }
    return NextResponse.json(clinicAppointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
