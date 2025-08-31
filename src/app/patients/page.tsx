import { fetchPatients } from '@/lib/data';
import AddPatientForm from '@/components/AddPatientForm';
import { Suspense } from 'react';

async function PatientList({ clinicId }: { clinicId: string }) {
  const patients = await fetchPatients(clinicId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Patients</h2>
      {patients.length === 0 ? (
        <p>No patients found for this clinic.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {patients.map((patient: any) => (
            <li key={patient.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-500">Age: {patient.age || 'N/A'}</p>
                <p className="text-sm text-gray-500">Contact: {patient.contact || 'N/A'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PatientsPage() {
  const clinicId = "clinic1"; // TODO: Replace with dynamic clinicId from middleware

  // Function to revalidate data (will be passed to AddPatientForm)
  const handlePatientAdded = () => {
    // This will trigger a re-fetch of patients on the client-side.
    // In a real app, you might use a state management solution or a more robust revalidation strategy.
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading patients...</div>}>
          <PatientList clinicId={clinicId} />
        </Suspense>
        <AddPatientForm clinicId={clinicId} onPatientAdded={handlePatientAdded} />
      </div>
    </div>
  );
}
