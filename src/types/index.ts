export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  photoUrl: string;
  role: string;
  type: 'prospect' | 'customer' | 'partner' | 'vendor';
}

export interface Lead {
  id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  source: string;
  salesRep: string;
  lifecycleStage: 'unqualified' | 'qualified' | 'opportunity' | 'client';
  score: number;
  createdAt: Date;
}

export interface Organization {
  id: string;
  organizationName: string;
  website: string | null;
  annualRevenue: number | null;
  country: string;
  numberOfEmployees: number | null;
  industry: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type OpportunityStatus = 
  | 'New'
  | 'Qualifying'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export interface Opportunity {
  id: string;
  title: string;
  status: OpportunityStatus;
  probability: number;
  value: number;
  expectedCloseDate: Date;
  organization: Organization | null;
  contact: Contact | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'New' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  taskId: string; // Auto-generated unique identifier (e.g., TASK-001)
  parentLead: Lead;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  assignedTo: string;
  createdDate: Date;
  lastModifiedDate: Date;
  lastModifiedBy: string;
}

export interface DashboardStats {
  unqualifiedLeads: number;
  qualifiedLeads: number;
  opportunities: number;
  clients: number;
}

export interface OpportunityStages {
  discovery: number;
  proposal: number;
  negotiation: number;
  closed: number;
}