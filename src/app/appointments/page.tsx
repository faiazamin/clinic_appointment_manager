import { fetchAppointments, fetchPatients } from '@/lib/data';
import AddAppointmentForm from '@/components/AddAppointmentForm';
import { Suspense } from 'react';

async function AppointmentList({ clinicId }: { clinicId: string }) {
  const appointments = await fetchAppointments(clinicId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found for this clinic.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment: any) => (
            <li key={appointment.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">Date: {appointment.date}</p>
                <p className="text-sm text-gray-500">Patient ID: {appointment.patientId}</p>
                <p className="text-sm text-gray-500">Reason: {appointment.reason || 'N/A'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  const clinicId = "clinic1"; // TODO: Replace with dynamic clinicId from middleware

  // Function to revalidate data (will be passed to AddAppointmentForm)
  const handleAppointmentAdded = () => {
    // This will trigger a re-fetch of appointments on the client-side.
    // In a real app, you might use a state management solution or a more robust revalidation strategy.
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading appointments...</div>}>
          <AppointmentList clinicId={clinicId} />
        </Suspense>
        <AddAppointmentForm clinicId={clinicId} onAppointmentAdded={handleAppointmentAdded} />
      </div>
    </div>
  );
}
