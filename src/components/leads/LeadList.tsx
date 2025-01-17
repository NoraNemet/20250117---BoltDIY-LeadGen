import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Upload, Filter, ArrowUpDown } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  createdAt: string;
  source: string;
  status: string;
  score: number;
}

interface LeadListProps {
  onAdd: () => void;
  onImport: () => void;
}

export function LeadList({ onAdd, onImport }: LeadListProps) {
  const leads: Lead[] = [
    {
      id: '1',
      name: 'Fazil Laghari',
      role: 'Director',
      email: 'fazzil72@gmail.com',
      phone: '(92) 306 8572 831',
      createdAt: '17 Feb, 2024',
      source: 'Facebook Campaign',
      status: 'Open',
      score: 45
    },
    // Add more mock leads here
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Leads (3,500)</h2>
          <div className="flex items-center space-x-2">
            <button className="btn-primary" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add new
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="btn-secondary" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </button>
            <button className="btn-secondary" onClick={onImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import Leads
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            
            <button className="btn-secondary">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort by
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/leads/${lead.id}`} className="text-blue-600 hover:text-blue-900">
                    {lead.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.email}</div>
                  <div className="text-sm text-gray-500">{lead.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="btn-secondary">Prev</button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded ${
                    page === 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="btn-secondary">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}