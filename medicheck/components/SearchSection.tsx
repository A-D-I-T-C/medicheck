'use client';

import DashboardCard from '@/components/DashboardCard';
import SearchBar from '@/components/SearchBar';

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  return (
    <DashboardCard title="Patient Search" className="md:col-span-2">
      <SearchBar onSearch={onSearch} className="w-full max-w-2xl mx-auto" />
    </DashboardCard>
  );
}