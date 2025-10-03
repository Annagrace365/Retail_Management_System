// src/utils/auth.ts
import { User } from '../types';

export const setToken = (access: string, refresh: string) => {
  localStorage.setItem('token', access);
  localStorage.setItem('refreshToken', refresh);
};

export const getToken = () => localStorage.getItem('token');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const hasRole = (role: string) => {
  const user = getUser();
  return user?.roles?.includes(role);
};
// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token; // true if token exists
};
