import React, { useState } from 'react';
import { LeadHeader } from '../components/leads/LeadHeader';
import { LeadStages } from '../components/leads/LeadStages';
import { ActivityLog } from '../components/leads/ActivityLog';
import { LeadTabs } from '../components/leads/LeadTabs';

const tabs = [
  { id: 'activity', label: 'Activity' },
  { id: 'appointments', label: 'Appointments', count: 1 },
  { id: 'proposals', label: 'Proposals', count: 1 },
  { id: 'invoices', label: 'Invoices' },
  { id: 'tasks', label: 'Tasks', count: 3 },
  { id: 'notes', label: 'Notes' },
];

const mockActivities = [
  {
    id: '1',
    type: 'Email Delivered: Proposal Sent',
    description: 'Proposal has been sent to the customer\'s email.',
    timestamp: 'Today 9:49 AM',
  },
  {
    id: '2',
    type: 'Stage: Request Received → Proposal Sent',
    description: 'Deal #192748 has been moved to the Proposal Sent stage.',
    timestamp: 'Today 9:48 AM',
  },
];

export function LeadPage() {
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LeadHeader
          leadName="Paint & Drywall Repairs"
          leadId="192748"
          stage="Proposal Sent"
          amount={2480}
        />
        
        <div className="mt-6">
          <LeadStages currentStage="Proposal Sent" />
        </div>

        <div className="mt-8">
          <LeadTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <div className="mt-6">
            {activeTab === 'activity' && (
              <ActivityLog activities={mockActivities} />
            )}
            {/* Other tab contents will be implemented in separate components */}
          </div>
        </div>
      </div>
    </div>
  );
}