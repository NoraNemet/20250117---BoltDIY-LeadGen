import React from 'react';
import { Send } from 'lucide-react';

interface ProspectTag {
  name: string;
  active?: boolean;
}

interface ProspectingCardProps {
  title: string;
  description: string;
  tags: ProspectTag[];
}

export function ProspectingCard({ title, description, tags }: ProspectingCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="p-3 bg-blue-600 rounded-full">
          <Send className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.name}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm
              ${tag.active 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700'}`}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}