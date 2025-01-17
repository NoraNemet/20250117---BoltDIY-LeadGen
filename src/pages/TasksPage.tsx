import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/common/Modal';
import { Breadcrumb } from '../components/common/Breadcrumb';
import type { Task, Lead } from '../types';

// Mock data for team members
const mockTeamMembers = [
  'John Smith',
  'Sarah Johnson',
  'Michael Chen',
  'Emily Brown',
  'David Wilson'
];

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'TechCorp Software Implementation',
    industry: 'Technology',
    email: 'contact@techcorp.com',
    phone: '(555) 123-4567',
    source: 'Website',
    salesRep: 'John Smith',
    lifecycleStage: 'qualified',
    score: 85,
    createdAt: new Date('2024-01-15')
  },
  // Add more mock leads...
];

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    taskId: 'TASK-001',
    parentLead: mockLeads[0],
    title: 'Initial Requirements Gathering',
    description: 'Schedule meeting with client to gather initial project requirements',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date('2024-03-20'),
    assignedTo: 'John Smith',
    createdDate: new Date('2024-03-15'),
    lastModifiedDate: new Date('2024-03-15'),
    lastModifiedBy: 'System'
  },
  // Add more mock tasks...
];

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleAdd = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleSubmit = (data: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              ...data,
              lastModifiedDate: new Date(),
              lastModifiedBy: 'Current User'
            }
          : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        taskId: `TASK-${(tasks.length + 1).toString().padStart(3, '0')}`,
        ...data as Omit<Task, 'id' | 'taskId' | 'createdDate' | 'lastModifiedDate' | 'lastModifiedBy'>,
        createdDate: new Date(),
        lastModifiedDate: new Date(),
        lastModifiedBy: 'Current User'
      };
      setTasks([...tasks, newTask]);
    }
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setTasks(tasks.filter(task => task.id !== deletingId));
    }
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const handleBulkUpdate = (ids: string[], updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      ids.includes(task.id)
        ? {
            ...task,
            ...updates,
            lastModifiedDate: new Date(),
            lastModifiedBy: 'Current User'
          }
        : task
    ));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Tasks' }]} />
          <div className="mt-2 flex items-center">
            <CheckSquare className="w-6 h-6 text-gray-400 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          </div>
        </div>

        <TaskTable
          tasks={tasks}
          onAdd={handleAdd}
          onImport={handleImport}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkUpdate={handleBulkUpdate}
        />

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingTask ? 'Edit Task' : 'Add Task'}
        >
          <TaskForm
            task={editingTask || undefined}
            leads={mockLeads}
            teamMembers={mockTeamMembers}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Task"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this task? This action cannot be undone.
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
                Delete Task
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="Import Tasks"
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
            <div className="mt-4">
              <h4 className="font-medium text-gray-900">CSV Format Requirements:</h4>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>Required columns: Title, Parent Lead ID, Status, Priority, Due Date, Assigned To</li>
                <li>Optional columns: Description</li>
                <li>First row should contain column headers</li>
                <li>Dates should be in YYYY-MM-DD format</li>
              </ul>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}