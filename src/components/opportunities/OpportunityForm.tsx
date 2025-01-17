import React, { useState } from 'react';
import { Switch } from 'lucide-react';
import type { Opportunity, Organization, Contact, OpportunityStatus } from '../../types';

interface OpportunityFormProps {
  opportunity?: Opportunity;
  organizations: Organization[];
  contacts: Contact[];
  onSubmit: (data: Partial<Opportunity>) => void;
  onCancel: () => void;
}

const STATUSES: OpportunityStatus[] = [
  'New',
  'Qualifying',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

export function OpportunityForm({
  opportunity,
  organizations,
  contacts,
  onSubmit,
  onCancel
}: OpportunityFormProps) {
  const [useExistingOrg, setUseExistingOrg] = useState(!!opportunity?.organization);
  const [useExistingContact, setUseExistingContact] = useState(!!opportunity?.contact);
  
  const [formData, setFormData] = useState({
    title: opportunity?.title || '',
    status: opportunity?.status || 'New',
    probability: opportunity?.probability?.toString() || '0',
    value: opportunity?.value?.toString() || '0',
    expectedCloseDate: opportunity?.expectedCloseDate
      ? new Date(opportunity.expectedCloseDate).toISOString().split('T')[0]
      : '',
    organizationId: opportunity?.organization?.id || '',
    contactId: opportunity?.contact?.id || '',
    
    // New organization fields
    organizationName: '',
    website: '',
    country: '',
    industry: '',
    
    // New contact fields
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactRole: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (useExistingOrg && !formData.organizationId) {
      newErrors.organizationId = 'Please select an organization';
    }

    if (useExistingContact && !formData.contactId) {
      newErrors.contactId = 'Please select a contact';
    }

    const probability = parseInt(formData.probability);
    if (isNaN(probability) || probability < 0 || probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: formData.title,
      status: formData.status as OpportunityStatus,
      probability: parseInt(formData.probability),
      value: parseFloat(formData.value),
      expectedCloseDate: new Date(formData.expectedCloseDate),
      organization: useExistingOrg
        ? organizations.find(org => org.id === formData.organizationId) || null
        : {
            organizationName: formData.organizationName,
            website: formData.website || null,
            country: formData.country,
            industry: formData.industry || null
          } as Organization,
      contact: useExistingContact
        ? contacts.find(contact => contact.id === formData.contactId) || null
        : {
            name: formData.contactName,
            email: formData.contactEmail,
            phone: formData.contactPhone,
            role: formData.contactRole
          } as Contact
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Opportunity Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.title ? 'border-red-300' : ''
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Link to Existing Organization?</span>
          <button
            type="button"
            onClick={() => setUseExistingOrg(!useExistingOrg)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              useExistingOrg ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              useExistingOrg ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {useExistingOrg ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Organization
            </label>
            <select
              value={formData.organizationId}
              onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select an organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.organizationName}
                </option>
              ))}
            </select>
            {errors.organizationId && (
              <p className="mt-1 text-sm text-red-600">{errors.organizationId}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select an industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Link to Existing Contact?</span>
          <button
            type="button"
            onClick={() => setUseExistingContact(!useExistingContact)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              useExistingContact ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              useExistingContact ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {useExistingContact ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Contact
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} - {contact.email}
                </option>
              ))}
            </select>
            {errors.contactId && (
              <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={formData.contactRole}
                onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {STATUSES.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Probability (%) *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.probability ? 'border-red-300' : ''
            }`}
          />
          {errors.probability && (
            <p className="mt-1 text-sm text-red-600">{errors.probability}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Value ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expected Close Date *
          </label>
          <input
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.expectedCloseDate ? 'border-red-300' : ''
            }`}
          />
          {errors.expectedCloseDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expectedCloseDate}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          {opportunity ? 'Update Opportunity' : 'Create Opportunity'}
        </button>
      </div>
    </form>
  );
}