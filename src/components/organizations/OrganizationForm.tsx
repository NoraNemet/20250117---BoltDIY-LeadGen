import React from 'react';
import type { Organization } from '../../types';

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: (data: Partial<Organization>) => void;
  onCancel: () => void;
}

export function OrganizationForm({ organization, onSubmit, onCancel }: OrganizationFormProps) {
  const [formData, setFormData] = React.useState({
    organizationName: organization?.organizationName || '',
    website: organization?.website || '',
    annualRevenue: organization?.annualRevenue?.toString() || '',
    country: organization?.country || '',
    numberOfEmployees: organization?.numberOfEmployees?.toString() || '',
    industry: organization?.industry || ''
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (formData.annualRevenue && !isValidNumber(formData.annualRevenue)) {
      newErrors.annualRevenue = 'Please enter a valid number';
    }

    if (formData.numberOfEmployees && !isValidInteger(formData.numberOfEmployees)) {
      newErrors.numberOfEmployees = 'Please enter a valid number';
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
      ...formData,
      annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : null,
      numberOfEmployees: formData.numberOfEmployees ? parseInt(formData.numberOfEmployees) : null,
      website: formData.website || null,
      industry: formData.industry || null
    });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidNumber = (value: string) => {
    return !isNaN(parseFloat(value)) && value.trim() !== '';
  };

  const isValidInteger = (value: string) => {
    return !isNaN(parseInt(value)) && Number.isInteger(parseFloat(value));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Organization Name *
        </label>
        <input
          type="text"
          value={formData.organizationName}
          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.organizationName ? 'border-red-300' : ''
          }`}
        />
        {errors.organizationName && (
          <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.website ? 'border-red-300' : ''
          }`}
          placeholder="https://example.com"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Annual Revenue
        </label>
        <input
          type="number"
          value={formData.annualRevenue}
          onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.annualRevenue ? 'border-red-300' : ''
          }`}
          placeholder="0.00"
          step="0.01"
        />
        {errors.annualRevenue && (
          <p className="mt-1 text-sm text-red-600">{errors.annualRevenue}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <input
          type="text"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.country ? 'border-red-300' : ''
          }`}
        />
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Employees
        </label>
        <input
          type="number"
          value={formData.numberOfEmployees}
          onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.numberOfEmployees ? 'border-red-300' : ''
          }`}
          step="1"
        />
        {errors.numberOfEmployees && (
          <p className="mt-1 text-sm text-red-600">{errors.numberOfEmployees}</p>
        )}
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
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
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
          {organization ? 'Update Organization' : 'Create Organization'}
        </button>
      </div>
    </form>
  );
}