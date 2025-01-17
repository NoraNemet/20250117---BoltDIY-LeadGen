import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { OpportunityTable } from '../components/opportunities/OpportunityTable';
import { OpportunityForm } from '../components/opportunities/OpportunityForm';
import { Modal } from '../components/common/Modal';
import { Breadcrumb } from '../components/common/Breadcrumb';
import type { Opportunity, Organization, Contact } from '../types';

// Mock data for organizations and contacts
const mockOrganizations: Organization[] = [
  {
    id: '1',
    organizationName: 'Tech Corp',
    website: 'https://techcorp.com',
    annualRevenue: 1000000,
    country: 'USA',
    numberOfEmployees: 100,
    industry: 'Technology',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Tech Corp',
    email: 'john@techcorp.com',
    phone: '(555) 123-4567',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop',
    role: 'CEO',
    type: 'prospect'
  }
];

// Mock opportunities data
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Enterprise Software Deal',
    status: 'Proposal',
    probability: 60,
    value: 50000,
    expectedCloseDate: new Date('2024-06-30'),
    organization: mockOrganizations[0],
    contact: mockContacts[0],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleAdd = () => {
    setEditingOpportunity(null);
    setShowModal(true);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleSubmit = (data: Partial<Opportunity>) => {
    if (editingOpportunity) {
      // Update existing opportunity
      setOpportunities(opportunities.map(opp =>
        opp.id === editingOpportunity.id
          ? { ...opp, ...data, updatedAt: new Date() }
          : opp
      ));
    } else {
      // Create new opportunity
      const newOpportunity: Opportunity = {
        id: Math.random().toString(36).substr(2, 9),
        ...data as Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setOpportunities([...opportunities, newOpportunity]);
    }
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setOpportunities(opportunities.filter(opp => opp.id !== deletingId));
    }
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Opportunities' }]} />
          <div className="mt-2 flex items-center">
            <Target className="w-6 h-6 text-gray-400 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-900">Opportunities</h1>
          </div>
        </div>

        <OpportunityTable
          opportunities={opportunities}
          onAdd={handleAdd}
          onImport={handleImport}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingOpportunity ? 'Edit Opportunity' : 'Add Opportunity'}
        >
          <OpportunityForm
            opportunity={editingOpportunity || undefined}
            organizations={mockOrganizations}
            contacts={mockContacts}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Opportunity"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this opportunity? This action cannot be undone.
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
                Delete Opportunity
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="Import Opportunities"
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  // Handle file import
                  setShowImportModal(false);
                }}
              />
              <p className="text-gray-600">
                Drag and drop your CSV file here, or click to browse
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}