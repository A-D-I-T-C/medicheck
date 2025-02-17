'use client';

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DashboardHeader from '@/components/DashboardHeader';
import PatientList from '@/components/PatientList';
import SearchSection from '@/components/SearchSection';
import { User } from '@/lib/db/schema';
import handler from '../actions';

export default function DoctorHomePage() {
  const [patients, setPatients] = useState<User[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPatients() {
      try {
        const patientsData = await handler();
        setPatients(patientsData);
        setFilteredPatients(patientsData);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    }

    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardHeader 
          title="Doctor Dashboard"
          description="Search for a patient or access recent sessions"
        />
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Search Section */}
          <SearchSection onSearch={handleSearch} />

          {/* Recent Patients Section */}
          <DashboardCard title="Recent Patients" className="md:col-span-2">
            <PatientList patients={filteredPatients} />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}