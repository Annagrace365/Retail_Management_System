export interface User {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface Customer {
  customer_id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  product_id: number;
  name: string;
  price: number;
  stock: number;
  suppliers: Supplier[];
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  supplier_id: number;
  name: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  order_id: number;
  customer: number;
  customer_name: string;
  order_date: string;
  amount: number;
  order_items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  payment_id: number;
  order: number;
  order_customer_name: string;
  amount: number;
  payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer';
  payment_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProductSupplier {
  product: number;
  supplier: number;
  product_name: string;
  supplier_name: string;
  created_at: string;
}

export interface DashboardStats {
  total_customers: number;
  total_products: number;
  total_orders: number;
  total_suppliers: number;
  total_revenue: number;
  low_stock_products: number;
  recent_orders: Order[];
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateOrderData {
  customer: number;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface CreatePaymentData {
  order: number;
  amount: number;
  payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer';
}

export interface CreateProductSupplierData {
  product: number;
  supplier: number;
}
