import React from 'react';
import { Mail, Phone, Building2, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Contact } from '../../types';

interface ContactCardProps extends Contact {
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ 
  id, name, company, email, phone, photoUrl, role, onEdit, onDelete, ...contact 
}: ContactCardProps) {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {showActions && (
        <div className="absolute top-12 right-4 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
          <button
            onClick={() => {
              setShowActions(false);
              onEdit({ id, name, company, email, phone, photoUrl, role, ...contact });
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              setShowActions(false);
              onDelete(id);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      )}

      <div className="flex items-start space-x-4">
        <img
          src={photoUrl}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-500">{role}</p>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              <span>{company}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <a href={`mailto:${email}`} className="hover:text-blue-600">{email}</a>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <a href={`tel:${phone}`} className="hover:text-blue-600">{phone}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}