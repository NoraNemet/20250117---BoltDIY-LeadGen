import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRole?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Checking permissions...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role?.name !== requiredRole) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-2 text-sm text-gray-500">
          You don't have the required permissions to access this page.
        </p>
      </div>
    );
  }

  if (requiredPermissions.length > 0 && 
      !requiredPermissions.every(permission => hasPermission(permission))) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-2 text-sm text-gray-500">
          You don't have the required permissions to access this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}