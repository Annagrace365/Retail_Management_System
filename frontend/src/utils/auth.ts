import { User } from '../types';

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const hasRole = (role: 'admin' | 'staff' | 'inventory_manager'): boolean => {
  const user = getUser();
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
