import React, { useState } from 'react';
import { ContactCard } from '../components/contacts/ContactCard';
import { ContactsSearch } from '../components/contacts/ContactsSearch';
import { ContactsFilter } from '../components/contacts/ContactsFilter';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Modal } from '../components/common/Modal';
import { ContactForm } from '../components/contacts/ContactForm';
import { Contact } from '../types';

export function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      email: 'sarah.j@techcorp.com',
      phone: '(555) 123-4567',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      role: 'Product Manager',
      type: 'customer'
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'Innovation Labs',
      email: 'm.chen@innolabs.com',
      phone: '(555) 987-6543',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      role: 'Technical Director',
      type: 'partner'
    },
  ]);

  const handleEdit = (contact: Contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      setDeleteContact(contact);
      setShowDeleteModal(true);
    }
  };

  const handleUpdateContact = (updatedContact: Partial<Contact>) => {
    if (editContact) {
      setContacts(contacts.map(contact => 
        contact.id === editContact.id 
          ? { ...contact, ...updatedContact }
          : contact
      ));
    }
    setShowEditModal(false);
    setEditContact(null);
  };

  const handleConfirmDelete = () => {
    if (deleteContact) {
      setContacts(contacts.filter(contact => contact.id !== deleteContact.id));
    }
    setShowDeleteModal(false);
    setDeleteContact(null);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilters.length === 0 || 
      activeFilters.includes(contact.type);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Contacts' }]} />
        
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <ContactsSearch onSearch={setSearchQuery} />
            <ContactsFilter onFilterChange={setActiveFilters} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map(contact => (
              <ContactCard 
                key={contact.id} 
                {...contact} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={editContact ? 'Edit Contact' : 'New Contact'}
      >
        <ContactForm
          contact={editContact || undefined}
          onSubmit={handleUpdateContact}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete {deleteContact?.name}? This action cannot be undone.
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
              Delete Contact
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}