import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LeadList } from '../components/leads/LeadList';
import { LeadPage } from './LeadPage';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { LeadStats } from '../components/leads/LeadStats';
import { Modal } from '../components/common/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { ImportLeads } from '../components/leads/ImportLeads';

export function LeadsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleAddLead = (data: any) => {
    console.log('Adding lead:', data);
    setShowAddModal(false);
  };

  const handleImportLeads = (file: File) => {
    console.log('Importing leads from:', file);
    setShowImportModal(false);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Breadcrumb items={[{ label: 'Leads' }]} />
                <LeadStats />
                <div className="mt-4">
                  <LeadList 
                    onAdd={() => setShowAddModal(true)} 
                    onImport={() => setShowImportModal(true)} 
                  />
                </div>
              </>
            }
          />
          <Route
            path="/:id"
            element={
              <>
                <Breadcrumb
                  items={[
                    { label: 'Leads', href: '/leads' },
                    { label: 'Lead Details' },
                  ]}
                />
                <div className="mt-4">
                  <LeadPage />
                </div>
              </>
            }
          />
        </Routes>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Lead"
      >
        <LeadForm
          onSubmit={handleAddLead}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Leads"
      >
        <ImportLeads onImport={handleImportLeads} />
      </Modal>
    </div>
  );
}