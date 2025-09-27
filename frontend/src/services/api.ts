import axios, { AxiosResponse } from 'axios';
import {
  LoginCredentials,
  AuthResponse,
  Customer,
  Product,
  Supplier,
  Order,
  Payment,
  ProductSupplier,
  DashboardStats,
  ApiResponse,
  CreateOrderData,
  CreatePaymentData,
  CreateProductSupplierData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login/', credentials),
  
  logout: (): Promise<AxiosResponse<void>> =>
    api.post('/auth/logout/'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (): Promise<AxiosResponse<DashboardStats>> =>
    api.get('/dashboard/stats/'),
};

// Customers API
export const customersAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Customer> | Customer[]>> =>
    api.get('/customers/'),
  
  getById: (id: number): Promise<AxiosResponse<Customer>> =>
    api.get(`/customers/${id}/`),
  
  create: (data: Omit<Customer, 'customer_id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Customer>> =>
    api.post('/customers/', data),
  
  update: (id: number, data: Partial<Omit<Customer, 'customer_id' | 'created_at' | 'updated_at'>>): Promise<AxiosResponse<Customer>> =>
    api.put(`/customers/${id}/`, data),
  
  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/customers/${id}/`),
};

// Products API
export const productsAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Product> | Product[]>> =>
    api.get('/products/'),
  
  getById: (id: number): Promise<AxiosResponse<Product>> =>
    api.get(`/products/${id}/`),
  
  create: (data: Omit<Product, 'product_id' | 'created_at' | 'updated_at' | 'suppliers'>): Promise<AxiosResponse<Product>> =>
    api.post('/products/', data),
  
  update: (id: number, data: Partial<Omit<Product, 'product_id' | 'created_at' | 'updated_at' | 'suppliers'>>): Promise<AxiosResponse<Product>> =>
    api.put(`/products/${id}/`, data),
  
  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/products/${id}/`),
  
  getLowStock: (): Promise<AxiosResponse<ApiResponse<Product> | Product[]>> =>
    api.get('/products/?low_stock=true'),
};

// Suppliers API
export const suppliersAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Supplier> | Supplier[]>> =>
    api.get('/suppliers/'),
  
  getById: (id: number): Promise<AxiosResponse<Supplier>> =>
    api.get(`/suppliers/${id}/`),
  
  create: (data: Omit<Supplier, 'supplier_id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Supplier>> =>
    api.post('/suppliers/', data),
  
  update: (id: number, data: Partial<Omit<Supplier, 'supplier_id' | 'created_at' | 'updated_at'>>): Promise<AxiosResponse<Supplier>> =>
    api.put(`/suppliers/${id}/`, data),
  
  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/suppliers/${id}/`),
};

// Orders API
export const ordersAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Order> | Order[]>> =>
    api.get('/orders/'),
  
  getById: (id: number): Promise<AxiosResponse<Order>> =>
    api.get(`/orders/${id}/`),
  
  create: (data: CreateOrderData): Promise<AxiosResponse<Order>> =>
    api.post('/orders/', data),
  
  update: (id: number, data: Partial<CreateOrderData>): Promise<AxiosResponse<Order>> =>
    api.put(`/orders/${id}/`, data),
  
  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/orders/${id}/`),
};

// Payments API
export const paymentsAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Payment> | Payment[]>> =>
    api.get('/payments/'),
  
  getById: (id: number): Promise<AxiosResponse<Payment>> =>
    api.get(`/payments/${id}/`),
  
  create: (data: CreatePaymentData): Promise<AxiosResponse<Payment>> =>
    api.post('/payments/', data),
  
  update: (id: number, data: Partial<CreatePaymentData>): Promise<AxiosResponse<Payment>> =>
    api.put(`/payments/${id}/`, data),
  
  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/payments/${id}/`),
};

// Product Suppliers API
export const productSuppliersAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<ProductSupplier> | ProductSupplier[]>> =>
    api.get('/product-suppliers/'),
  
  create: (data: CreateProductSupplierData): Promise<AxiosResponse<ProductSupplier>> =>
    api.post('/product-suppliers/', data),
  
  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/product-suppliers/${id}/`),
};

export default api;