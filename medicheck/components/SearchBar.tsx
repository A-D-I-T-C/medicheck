'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [input, setInput] = useState('');

  return (
    <div className="my-4">
      <input
        type="text"
        placeholder="Search for a patient..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={() => onSearch(input)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
}
