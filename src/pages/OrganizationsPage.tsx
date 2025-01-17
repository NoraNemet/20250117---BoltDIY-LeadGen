import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { OrganizationTable } from '../components/organizations/OrganizationTable';
import { OrganizationForm } from '../components/organizations/OrganizationForm';
import { Modal } from '../components/common/Modal';
import { Breadcrumb } from '../components/common/Breadcrumb';
import type { Organization } from '../types';

// Mock data
const mockOrganizations: Organization[] = [
  {
    id: '1',
    organizationName: 'Tech Innovators Inc.',
    website: 'https://techinnovators.com',
    annualRevenue: 5000000,
    country: 'United States',
    numberOfEmployees: 150,
    industry: 'Technology',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    organizationName: 'Global Healthcare Solutions',
    website: 'https://globalhealthcare.org',
    annualRevenue: 12000000,
    country: 'United Kingdom',
    numberOfEmployees: 500,
    industry: 'Healthcare',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20')
  },
  {
    id: '3',
    organizationName: 'Finance Plus',
    website: 'https://financeplus.com',
    annualRevenue: 8000000,
    country: 'Singapore',
    numberOfEmployees: 200,
    industry: 'Finance',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10')
  }
];

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [showModal, setShowModal] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingOrganization(null);
    setShowModal(true);
  };

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleSubmit = (data: Partial<Organization>) => {
    if (editingOrganization) {
      // Update existing organization
      setOrganizations(organizations.map(org =>
        org.id === editingOrganization.id
          ? { ...org, ...data, updatedAt: new Date() }
          : org
      ));
    } else {
      // Create new organization
      const newOrganization: Organization = {
        id: Math.random().toString(36).substr(2, 9),
        ...data as Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setOrganizations([...organizations, newOrganization]);
    }
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setOrganizations(organizations.filter(org => org.id !== deletingId));
    }
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Organizations' }]} />
          <div className="mt-2 flex items-center">
            <Building2 className="w-6 h-6 text-gray-400 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
          </div>
        </div>

        <OrganizationTable
          organizations={organizations}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingOrganization ? 'Edit Organization' : 'Add Organization'}
        >
          <OrganizationForm
            organization={editingOrganization || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Organization"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this organization? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete Organization
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}