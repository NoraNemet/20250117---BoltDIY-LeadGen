import React from 'react';
import { Search } from 'lucide-react';

interface ContactAvatar {
  id: number;
  image: string;
  position: { top: string; left: string };
}

export function ContactInfoCard() {
  const avatars: ContactAvatar[] = [
    { id: 1, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", position: { top: "20%", left: "20%" } },
    { id: 2, image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36", position: { top: "20%", left: "70%" } },
    { id: 3, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", position: { top: "70%", left: "30%" } },
    { id: 4, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", position: { top: "70%", left: "70%" } },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-semibold">Find Contact Info</h3>
        <div className="p-3 bg-blue-600 rounded-full">
          <Search className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="relative h-48 mb-6">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className="absolute w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md"
            style={{ top: avatar.position.top, left: avatar.position.left }}
          >
            <img
              src={`${avatar.image}?w=100&h=100&fit=crop`}
              alt="Contact"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md">
          Generate
        </button>
      </div>
      
      <p className="text-gray-600">
        Bypass hours of researching with our technology that automatically locates and predicts professional email addresses.
      </p>
    </div>
  );
}