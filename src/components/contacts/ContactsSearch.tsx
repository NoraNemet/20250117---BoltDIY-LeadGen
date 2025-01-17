import React from 'react';
import { Search } from 'lucide-react';

interface ContactsSearchProps {
  onSearch: (query: string) => void;
}

export function ContactsSearch({ onSearch }: ContactsSearchProps) {
  return (
    <div className="relative max-w-md w-full">
      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search contacts..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}