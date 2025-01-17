import React from 'react';
import { BarChart, Activity } from 'lucide-react';

interface LifecycleChartProps {
  stages: {
    unqualified: number;
    qualified: number;
    opportunity: number;
    client: number;
  };
}

export function LifecycleChart({ stages }: LifecycleChartProps) {
  const max = Math.max(...Object.values(stages));
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold">Lead Lifecycle Stages</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(stages).map(([stage, value]) => (
          <div key={stage} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{stage}</span>
              <span className="font-medium">{value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}