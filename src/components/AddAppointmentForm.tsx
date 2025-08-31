import { useState, useEffect } from 'react';
import { fetchPatients } from '@/lib/data';

interface AddAppointmentFormProps {
  clinicId: string;
  onAppointmentAdded: () => void;
}

interface Patient {
  id: string;
  name: string;
}

export default function AddAppointmentForm({ clinicId, onAppointmentAdded }: AddAppointmentFormProps) {
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  useEffect(() => {
    async function getPatients() {
      try {
        const fetchedPatients = await fetchPatients(clinicId);
        setPatients(fetchedPatients);
      } catch (err: any) {
        setPatientsError(err.message);
      } finally {
        setPatientsLoading(false);
      }
    }
    getPatients();
  }, [clinicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clinicId, patientId, date, reason }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add appointment');
      }

      setSuccess('Appointment added successfully!');
      setPatientId('');
      setDate('');
      setReason('');
      onAppointmentAdded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (patientsLoading) {
    return <div className="bg-white p-6 rounded-lg shadow-md">Loading patients for appointment form...</div>;
  }

  if (patientsError) {
    return <div className="bg-white p-6 rounded-lg shadow-md text-red-500">Error loading patients: {patientsError}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Appointment</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <div>
        <label htmlFor="patient" className="block text-sm font-medium text-gray-700">Patient</label>
        <select
          id="patient"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
        <input
          type="text"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Appointment'}
      </button>
    </form>
  );
}
