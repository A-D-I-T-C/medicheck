'use client';

import Link from 'next/link';

const recentPatients = [
  { id: '123', name: 'John Doe' },
  { id: '456', name: 'Jane Smith' },
];

export default function PatientList() {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Recently Accessed Patients</h2>
      <ul>
        {recentPatients.map((patient) => (
          <li key={patient.id} className="border p-2 rounded my-2">
            <Link href={`/doctor/session/${patient.id}`}>
              {patient.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
