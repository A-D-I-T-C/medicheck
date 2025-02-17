import Link from 'next/link';
import { User } from '@/lib/db/schema';

interface PatientListProps {
  patients: User[];
}

export default function PatientList({ patients }: PatientListProps) {
  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <Link key={patient.id} href={`/doctor/session/${patient.id}`} className="block group">
          <div className="relative overflow-hidden">
            <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4
              transition-all duration-300 
              hover:bg-gray-800/60 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/10
              group-hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-100 truncate">
                      Name: {patient.name ?? 'Unknown'}
                    </p>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4">
                    <p className="text-sm text-gray-400">
                      Email: {patient.email}
                    </p>
                    <span className="text-gray-600">•</span>
                    <p className="text-sm text-gray-400">
                      Role: {patient.role}
                    </p>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0 text-gray-400 transition-transform duration-300 group-hover:translate-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}