import { useAuth } from './useAuth';
import { Permission } from '../types/auth';

export function usePermissions() {
  const { user } = useAuth();
  
  const hasPermission = (permission: string) => {
    if (!user?.role?.permissions) return false;
    return user.role.permissions.some(p => p.name === permission);
  };

  const can = (action: string, resource: string) => {
    if (!user?.role?.permissions) return false;
    return user.role.permissions.some(
      p => p.action === action && p.resource === resource
    );
  };

  return {
    hasPermission,
    can,
    isAdmin: user?.role?.name === 'admin',
    isManager: user?.role?.name === 'manager',
    isMember: user?.role?.name === 'member'
  };
}