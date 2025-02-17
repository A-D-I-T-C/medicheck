'use client';

import DashboardHeader from '@/components/DashboardHeader';

export default function PatientHomePage() {

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-orange-900/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardHeader 
          title="Patient Dashboard"
          description="Search for a patient or access recent sessions"
        />
      </div>
    </div>
  );
}
