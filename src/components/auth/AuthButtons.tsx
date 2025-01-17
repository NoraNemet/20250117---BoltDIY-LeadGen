import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AuthButtons() {
  const { user } = useAuth();

  if (user) {
    return (
      <Link
        to="/account"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        My Account
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/login"
        className="text-sm font-medium text-gray-700 hover:text-blue-600"
      >
        Sign in
      </Link>
      <Link
        to="/signup"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Sign up
      </Link>
    </div>
  );
}