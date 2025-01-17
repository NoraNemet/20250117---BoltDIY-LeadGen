import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User'
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial auth check
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        setUser(mockUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login logic
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      setUser(mockUser);
      return { error: null };
    }
    return { error: new Error('Invalid credentials') };
  };

  const logout = async () => {
    localStorage.removeItem('isLoggedIn');
    setUser(null);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Mock signup logic
    if (email && password && name) {
      localStorage.setItem('isLoggedIn', 'true');
      setUser({ ...mockUser, email, name });
      return { error: null };
    }
    return { error: new Error('Invalid signup data') };
  };

  return { user, loading, login, logout, signUp };
}