import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'inventory_manager';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If no specific role required, just check authentication
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check role-based access
  const hasAccess = () => {
    switch (requiredRole) {
      case 'admin':
        return hasRole('admin');
      case 'staff':
        return hasRole('staff');
      case 'inventory_manager':
        return hasRole('inventory_manager');
      default:
        return true;
    }
  };

  if (!hasAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have permission to access this page.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="btn btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Helper function to check roles (imported from utils)
const hasRole = (role: 'admin' | 'staff' | 'inventory_manager'): boolean => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user) return false;
  
  switch (role) {
    case 'admin':
      return user.is_superuser;
    case 'staff':
      return user.is_staff || user.is_superuser;
    case 'inventory_manager':
      return user.is_staff || user.is_superuser;
    default:
      return false;
  }
};

export default ProtectedRoute;
