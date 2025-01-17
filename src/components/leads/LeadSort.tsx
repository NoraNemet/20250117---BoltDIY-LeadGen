import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface LeadSortProps {
  onSort: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
}

export function LeadSort({ onSort }: LeadSortProps) {
  const sortOptions: SortOption[] = [
    {
      label: 'Name',
      value: 'name',
      icon: <ArrowUpDown className="w-4 h-4" />,
    },
    {
      label: 'Lead Score',
      value: 'score',
      icon: <ArrowDown className="w-4 h-4" />,
    },
    {
      label: 'Date Created',
      value: 'createdAt',
      icon: <ArrowUp className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative">
      <div className="absolute z-10 mt-1 w-56 rounded-md bg-white shadow-lg">
        <div className="py-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSort({ field: option.value, direction: 'asc' })}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="flex-1">{option.label}</span>
              {option.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}