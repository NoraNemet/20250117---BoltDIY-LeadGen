import React from 'react';
import { Users, CheckCircle, PhoneOff } from 'lucide-react';

interface StatTileProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

function StatTile({ title, value, subtitle, icon, gradient }: StatTileProps) {
  return (
    <div className={`${gradient} rounded-lg p-6 text-white`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
          <p className="text-sm mt-2 opacity-80">{subtitle}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function LeadStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatTile
        title="Total Leads"
        value={3500}
        subtitle="Total number of leads in database"
        icon={<Users className="w-6 h-6 text-white" />}
        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <StatTile
        title="Qualified Leads"
        value={1250}
        subtitle="Leads marked as qualified"
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        gradient="bg-gradient-to-br from-green-500 to-green-600"
      />
      <StatTile
        title="Uncontacted Leads"
        value={850}
        subtitle="Leads requiring follow-up"
        icon={<PhoneOff className="w-6 h-6 text-white" />}
        gradient="bg-gradient-to-br from-orange-500 to-orange-600"
      />
    </div>
  );
}