import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface ContactsFilterProps {
  onFilterChange: (filters: string[]) => void;
}

export function ContactsFilter({ onFilterChange }: ContactsFilterProps) {
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  
  const filterOptions: FilterOption[] = [
    { label: 'Customers', value: 'customer' },
    { label: 'Prospects', value: 'prospect' },
    { label: 'Partners', value: 'partner' },
    { label: 'Vendors', value: 'vendor' },
  ];

  const handleFilterClick = (value: string) => {
    const newFilters = activeFilters.includes(value)
      ? activeFilters.filter(f => f !== value)
      : [...activeFilters, value];
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Filters:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleFilterClick(value)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm
              ${activeFilters.includes(value)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {label}
            {activeFilters.includes(value) && (
              <X className="w-3 h-3 ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}