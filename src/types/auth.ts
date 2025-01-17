export type UserRole = 'admin' | 'manager' | 'member';

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: UserRole;
  description: string | null;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark';
  timezone: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string | null;
  lastActive: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string | null;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  department: string | null;
  photoUrl: string | null;
  phone: string | null;
  role: Role;
  twoFactorEnabled: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}