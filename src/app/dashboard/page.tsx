import { fetchPatients, fetchAppointments } from '@/lib/data';
import { Suspense } from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
}

function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const clinicId = "clinic1"; // TODO: Replace with dynamic clinicId from middleware

  const [patients, appointments, upcomingAppointments] = await Promise.all([
    fetchPatients(clinicId),
    fetchAppointments(clinicId),
    fetchAppointments(clinicId, true),
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading Patients...</div>}>
          <DashboardCard title="Total Patients" value={patients.length} />
        </Suspense>
        <Suspense fallback={<div>Loading Appointments...</div>}>
          <DashboardCard title="Total Appointments" value={appointments.length} />
        </Suspense>
        <Suspense fallback={<div>Loading Upcoming Appointments</div>}>
          <DashboardCard title="Upcoming Appointments" value={upcomingAppointments.length} />
        </Suspense>
      </div>
    </div>
  );
}
