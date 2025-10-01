// src/services/api.ts
import axios, { AxiosResponse } from 'axios';
import { 
  DashboardStats, Customer, Product, Supplier, Order, Payment, ProductSupplier, LoginCredentials, AuthResponse, User 
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- AUTH --------------------
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/token/', credentials),
  
  refresh: (refreshToken: string): Promise<AxiosResponse<{ access: string }>> =>
    api.post('/token/refresh/', { refresh: refreshToken }),
  
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/users/me/'),
};

// -------------------- DASHBOARD --------------------
export const dashboardAPI = {
  getStats: (): Promise<AxiosResponse<DashboardStats>> => api.get('/dashboard/'),
};

// -------------------- CUSTOMERS --------------------
export const customersAPI = {
  getAll: (): Promise<AxiosResponse<Customer[]>> => api.get('/customers/'),
  getById: (id: number) => api.get(`/customers/${id}/`),
  create: (data: Partial<Customer>) => api.post('/customers/', data),
  update: (id: number, data: Partial<Customer>) => api.put(`/customers/${id}/`, data),
  delete: (id: number) => api.delete(`/customers/${id}/`),
};

// -------------------- PRODUCTS --------------------
export const productsAPI = {
  getAll: (): Promise<AxiosResponse<Product[]>> => api.get('/products/'),
  getById: (id: number) => api.get(`/products/${id}/`),
  create: (data: Partial<Product>) => api.post('/products/', data),
  update: (id: number, data: Partial<Product>) => api.put(`/products/${id}/`, data),
  delete: (id: number) => api.delete(`/products/${id}/`),
};

// -------------------- SUPPLIERS --------------------
export const suppliersAPI = {
  getAll: (): Promise<AxiosResponse<Supplier[]>> => api.get('/suppliers/'),
  getById: (id: number) => api.get(`/suppliers/${id}/`),
  create: (data: Partial<Supplier>) => api.post('/suppliers/', data),
  update: (id: number, data: Partial<Supplier>) => api.put(`/suppliers/${id}/`, data),
  delete: (id: number) => api.delete(`/suppliers/${id}/`),
};

// -------------------- ORDERS --------------------
export const ordersAPI = {
  getAll: (): Promise<AxiosResponse<Order[]>> => api.get('/orders/'),
  getById: (id: number) => api.get(`/orders/${id}/`),
  create: (data: any) => api.post('/orders/', data),
  update: (id: number, data: any) => api.put(`/orders/${id}/`, data),
  delete: (id: number) => api.delete(`/orders/${id}/`),
};

// -------------------- PAYMENTS --------------------
export const paymentsAPI = {
  getAll: (): Promise<AxiosResponse<Payment[]>> => api.get('/payments/'),
  getById: (id: number) => api.get(`/payments/${id}/`),
  create: (data: any) => api.post('/payments/', data),
  update: (id: number, data: any) => api.put(`/payments/${id}/`, data),
  delete: (id: number) => api.delete(`/payments/${id}/`),
};

// -------------------- PRODUCT-SUPPLIER --------------------
export const productSuppliersAPI = {
  getAll: (): Promise<AxiosResponse<ProductSupplier[]>> => api.get('/product-suppliers/'),
  create: (data: any) => api.post('/product-suppliers/', data),
  delete: (productId: number, supplierId: number) =>
    api.delete(`/product-suppliers/?product=${productId}&supplier=${supplierId}`),
};

export default api;
