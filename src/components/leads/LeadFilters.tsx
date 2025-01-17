import React from 'react';
import { Calendar, X } from 'lucide-react';

interface FilterProps {
  onFilter: (filters: any) => void;
  onClose: () => void;
}

export function LeadFilters({ onFilter, onClose }: FilterProps) {
  const [filters, setFilters] = React.useState({
    dateRange: {
      start: '',
      end: '',
    },
    source: '',
    status: '',
  });

  const handleApply = () => {
    onFilter(filters);
    onClose();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Filter Leads</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="pl-10 block w-full rounded-md border-gray-300"
              />
            </div>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="pl-10 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lead Source</label>
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">All Sources</option>
            <option value="facebook">Facebook Campaign</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lead Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}