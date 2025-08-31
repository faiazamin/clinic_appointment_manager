export async function fetchPatients(clinicId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/patients?clinicId=${clinicId}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch patients');
  }
  return res.json();
}

export async function fetchAppointments(clinicId: string, upcoming?: boolean) {
  const url = upcoming ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments?clinicId=${clinicId}&upcoming=true` : `${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments?clinicId=${clinicId}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return res.json();
}

export async function fetchClinics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clinics`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch clinics');
  }
  return res.json();
}
