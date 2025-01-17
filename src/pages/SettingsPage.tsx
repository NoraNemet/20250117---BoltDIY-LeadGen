import React, { useState } from 'react';
import { Settings, Users, Lock, Bell, Palette } from 'lucide-react';
import { UserManagement } from '../components/users/UserManagement';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const tabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Settings className="w-6 h-6 text-gray-400 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        <div className="flex space-x-6">
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 mr-3 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow">
            {activeTab === 'users' && (
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            )}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your security preferences and two-factor authentication.
                </p>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure how and when you receive notifications.
                </p>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Appearance Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Customize the look and feel of your dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}