import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface ActivityLogProps {
  activities: Activity[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Latest Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                {activity.icon || <Mail className="w-4 h-4 text-blue-600" />}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.type}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-sm text-gray-500">{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}