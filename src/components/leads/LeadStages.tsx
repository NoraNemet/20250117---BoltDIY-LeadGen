import React from 'react';
import { Check } from 'lucide-react';

const stages = [
  'New Leads',
  'Request Received',
  'In Draft',
  'Proposal Sent',
  'Approved',
  'Rejected'
];

interface LeadStagesProps {
  currentStage: string;
}

export function LeadStages({ currentStage }: LeadStagesProps) {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="flex w-full">
      {stages.map((stage, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = stage === currentStage;

        return (
          <div key={stage} className="flex-1 relative">
            <div
              className={`h-2 ${
                isActive ? 'bg-blue-600' : 'bg-gray-200'
              } ${index === 0 ? 'rounded-l' : ''} ${
                index === stages.length - 1 ? 'rounded-r' : ''
              }`}
            />
            <div className="mt-2 text-xs text-center">
              {stage}
              {isCurrent && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}