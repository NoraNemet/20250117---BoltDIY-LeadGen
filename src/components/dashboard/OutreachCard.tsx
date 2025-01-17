import React from 'react';
import { LineChart, Mail } from 'lucide-react';

export function OutreachCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-semibold">Scale Your Outreach</h3>
        <div className="p-3 bg-blue-600 rounded-full">
          <Mail className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="relative h-48 mb-6">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-blue-600/10 rounded-b-lg">
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  1500 Email
                </div>
              </div>
              <div className="absolute bottom-8 left-4 right-4">
                <div className="h-1 bg-blue-600 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600">
        Qualify and engage with thousands of leads daily. Our platform's efficiency turns what used to be impossible into your new daily reality.
      </p>
    </div>
  );
}