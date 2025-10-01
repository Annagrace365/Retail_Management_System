// src/types/index.ts

// -------------------- AUTH / USER --------------------
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  roles?: string[]; // admin, staff, inventory_manager
}

// -------------------- LOGIN --------------------
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

// -------------------- DASHBOARD --------------------
export interface DashboardStats {
  total_customers: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  total_suppliers: number;
  low_stock_products: number;
  recent_orders: {
    order_id: number;
    customer_name: string;
    order_date: string;
    amount: number;
  }[];
}

// -------------------- CUSTOMERS --------------------
export interface Customer {
  customer_id: number;
  name: string;
  address: string;
  phone: string;
}

// -------------------- SUPPLIERS --------------------
export interface Supplier {
  supplier_id: number;
  name: string;
  contact: string;
}

// -------------------- PRODUCTS --------------------
export interface Product {
  product_id: number;
  name: string;
  price: number;
  stock: number;
}

// -------------------- ORDERS --------------------
export interface Order {
  order_id: number;
  customer: Customer;
  order_date: string;
  amount: number;
  items?: OrderItem[];
}

// -------------------- ORDER ITEMS --------------------
export interface OrderItem {
  order: Order;
  product: Product;
  quantity: number;
}

// -------------------- PAYMENTS --------------------
export interface Payment {
  payment_id: number;
  order: Order;
  amount: number;
  payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer';
  payment_date: string;
}

// -------------------- PRODUCT-SUPPLIER --------------------
export interface ProductSupplier {
  product: Product;
  supplier: Supplier;
}
