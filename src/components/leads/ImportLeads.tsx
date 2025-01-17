import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImportLeadsProps {
  onImport: (file: File) => void;
}

export function ImportLeads({ onImport }: ImportLeadsProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your CSV file here, or
          <label className="mx-2 text-blue-600 hover:text-blue-500 cursor-pointer">
            browse
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleChange}
            />
          </label>
        </p>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900">CSV Format Requirements:</h4>
        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
          <li>Required columns: Name, Email, Phone, Role</li>
          <li>Optional columns: Lead Source, Status</li>
          <li>First row should contain column headers</li>
          <li>UTF-8 encoding</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          disabled={!selectedFile}
          onClick={handleImport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Import Leads
        </button>
      </div>
    </div>
  );
}