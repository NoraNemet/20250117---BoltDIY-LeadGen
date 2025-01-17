import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCircle, Target, 
  CheckSquare, BarChart3, Settings, HelpCircle,
  ChevronLeft, ChevronRight, Building2
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Leads', icon: Users, href: '/leads' },
  { name: 'Contacts', icon: UserCircle, href: '/contacts' },
  { name: 'Organizations', icon: Building2, href: '/organizations' },
  { name: 'Opportunities', icon: Target, href: '/opportunities' },
  { name: 'Tasks', icon: CheckSquare, href: '/tasks' },
  { name: 'Reports', icon: BarChart3, href: '/reports' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Support', icon: HelpCircle, href: '/support' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`flex flex-col ${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <span className="text-xl font-semibold">LeadGen Pro</span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}
                ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : ''}
            >
              <item.icon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}