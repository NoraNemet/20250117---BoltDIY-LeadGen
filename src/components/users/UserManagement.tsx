import React, { useState, useEffect } from 'react';
import { User, UserPlus, Shield, Settings, Search, Filter, MoreVertical, AlertCircle } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { supabase } from '../../lib/supabase';
import { Modal } from '../common/Modal';
import type { UserProfile, Role } from '../../types/auth';

interface UserFilters {
  role?: string;
  status?: 'active' | 'inactive';
  dateRange?: {
    start: string;
    end: string;
  };
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<{
    title: string;
    message: string;
    action: () => void;
  } | null>(null);
  const { can } = usePermissions();

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [currentPage, filters]);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        role:user_roles(
          role:roles(
            *,
            permissions:role_permissions(
              permission:permissions(*)
            )
          )
        )
      `)
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const loadRoles = async () => {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        permissions:role_permissions(
          permission:permissions(*)
        )
      `);

    if (!error && data) {
      setRoles(data);
    }
  };

  const handleUpdateRole = async (userId: string, roleId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role_id: roleId });

    if (!error) {
      loadUsers();
    }
  };

  const handleBulkAction = (action: 'deactivate' | 'reactivate' | 'delete') => {
    setConfirmationAction({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Users`,
      message: `Are you sure you want to ${action} the selected users? This action ${
        action === 'delete' ? 'cannot' : 'can'
      } be undone.`,
      action: async () => {
        // Implement bulk action logic here
        setSelectedUsers([]);
        setShowConfirmation(false);
        loadUsers();
      }
    });
    setShowConfirmation(true);
  };

  const handleResetPassword = async (userId: string) => {
    setConfirmationAction({
      title: 'Reset Password',
      message: 'Are you sure you want to reset this user\'s password? They will receive an email with instructions.',
      action: async () => {
        // Implement password reset logic here
        setShowConfirmation(false);
      }
    });
    setShowConfirmation(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filters.role || user.role?.name === filters.role;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <div className="flex items-center space-x-2">
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="btn-secondary"
                >
                  Deactivate Selected
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn-secondary text-red-600 hover:text-red-700"
                >
                  Delete Selected
                </button>
              </div>
            )}
            {can('manage', 'users') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={(e) => {
                    setSelectedUsers(
                      e.target.checked ? users.map(u => u.id) : []
                    );
                  }}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                2FA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      setSelectedUsers(
                        e.target.checked
                          ? [...selectedUsers, user.id]
                          : selectedUsers.filter(id => id !== user.id)
                      );
                    }}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.photoUrl ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.photoUrl}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {can('manage', 'roles') ? (
                    <select
                      value={user.role?.id}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role?.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.twoFactorEnabled ? (
                    <Shield className="w-5 h-5 text-green-500" />
                  ) : (
                    <Shield className="w-5 h-5 text-gray-300" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * itemsPerPage >= users.length}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
      >
        {/* Add user form will be implemented */}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Edit User"
      >
        {/* Edit user form will be implemented */}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Users"
      >
        {/* Filter form will be implemented */}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title={confirmationAction?.title || ''}
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
            <p className="text-gray-600">{confirmationAction?.message}</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmationAction?.action()}
              className="btn-primary"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}