import React from 'react';
import { FileText, Calendar, MoreHorizontal } from 'lucide-react';

interface LeadHeaderProps {
  leadName: string;
  leadId: string;
  stage: string;
  amount: number;
}

export function LeadHeader({ leadName, leadId, stage, amount }: LeadHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{leadName}</h1>
          <p className="text-sm text-gray-500">Deal #{leadId}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary">
            <FileText className="w-4 h-4 mr-2" />
            New Proposal
          </button>
          <button className="btn-secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </button>
          <button className="btn-icon">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">${amount.toLocaleString()}</span>
          <span className="text-sm text-gray-500">|</span>
          <span className="text-sm text-gray-600">{stage}</span>
        </div>
      </div>
    </div>
  );
}