'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import PatientList from '@/components/PatientList';
import SearchBar from '@/components/SearchBar';

export default function DoctorHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navigate to session details if a patient is selected
    router.push(`/doctor/session/${query}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
      <p className="text-gray-600">Search for a patient or access recent sessions.</p>

      {/* Search bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Recently accessed patients */}
      <PatientList />
    </div>
  );
}