import React, { useState, useEffect } from 'react';
import { 
  Users, Target, TrendingUp, DollarSign, Search, Plus, 
  Download, Bell, User, ChevronDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface KPICard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface OpportunityCard {
  id: string;
  title: string;
  value: number;
  status: string;
  lastInteraction: string;
  progress: number;
}

const kpiData: KPICard[] = [
  {
    title: 'Total Leads',
    value: 2459,
    change: 12.5,
    icon: <Users className="w-6 h-6 text-blue-600" />
  },
  {
    title: 'Opportunities',
    value: 428,
    change: 8.2,
    icon: <Target className="w-6 h-6 text-green-600" />
  },
  {
    title: 'Conversion Rate',
    value: 17.4,
    change: -2.4,
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />
  },
  {
    title: 'Revenue',
    value: 856200,
    change: 24.3,
    icon: <DollarSign className="w-6 h-6 text-yellow-600" />
  }
];

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'New Lead',
    description: 'Sarah Johnson from TechCorp Inc. was added as a new lead',
    timestamp: '2 hours ago',
    icon: <Users className="w-4 h-4 text-blue-600" />
  },
  // Add more activities...
];

const topOpportunities: OpportunityCard[] = [
  {
    id: '1',
    title: 'Enterprise Software Deal',
    value: 75000,
    status: 'Negotiation',
    lastInteraction: '2 days ago',
    progress: 75
  },
  // Add more opportunities...
];

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Implement data refresh logic here
    const refreshInterval = setInterval(() => {
      // Refresh data
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Lead
              </button>
              <button className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn-icon relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    {/* Add dropdown menu items */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-semibold mt-2">
                    {kpi.title === 'Revenue' 
                      ? `$${kpi.value.toLocaleString()}`
                      : kpi.title === 'Conversion Rate'
                        ? `${kpi.value}%`
                        : kpi.value.toLocaleString()}
                  </p>
                  <div className={`flex items-center mt-2 ${
                    kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change >= 0 
                      ? <ArrowUpRight className="w-4 h-4 mr-1" />
                      : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    <span className="text-sm font-medium">
                      {Math.abs(kpi.change)}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {kpi.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Charts Section */}
          <div className="space-y-6">
            {/* Lead Source Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Lead Sources</h3>
              <div className="h-64">
                {/* Add Chart.js implementation here */}
              </div>
            </div>

            {/* Opportunity Pipeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Pipeline</h3>
              <div className="h-64">
                {/* Add Chart.js implementation here */}
              </div>
            </div>
          </div>

          {/* Activity and Opportunities Section */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {activity.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-sm text-gray-500">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Opportunities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Top Opportunities</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All (24)
                </button>
              </div>
              <div className="space-y-4">
                {topOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {opportunity.title}
                      </h4>
                      <span className="text-sm font-medium text-gray-600">
                        ${opportunity.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{opportunity.status}</span>
                      <span>{opportunity.lastInteraction}</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${opportunity.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}