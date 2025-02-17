'use client';

import { useRouter } from 'next/navigation';
import DashboardCard from '@/components/DashboardCard';
import SearchBar from '@/components/SearchBar';

export default function SearchSection() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/doctor/session/${query}`);
  };

  return (
    <DashboardCard title="Patient Search" className="md:col-span-2">
      <SearchBar 
        onSearch={handleSearch}
        className="w-full max-w-2xl mx-auto"
      />
    </DashboardCard>
  );
}