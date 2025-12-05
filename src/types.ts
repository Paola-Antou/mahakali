// User types
export interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export interface UserPermissions {
  can_stock: boolean;
  can_movements: boolean;
  can_expenses: boolean;
  can_dashboard: boolean;
  can_sales: boolean;
  can_debtors: boolean;
  can_invoices: boolean;
}

// Product types
export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  initial_stock: number;
  min_stock: number;
  unit_price: number;
  purchase_price: number;
  reseller_price: number;
  image_path: string;
  created_by: number;
  creator_email?: string;
}

// Movement types
export interface Movement {
  id: number;
  date: string;
  type: 'ENTREE' | 'SORTIE';
  product_id: number;
  quantity: number;
  unit_price: number | null;
  client_name: string;
  client_phone: string;
  comment: string;
  created_by: number;
  product_code?: string;
  product_name?: string;
  creator_email?: string;
}

// Expense types
export interface Expense {
  id: number;
  date: string;
  description: string;
  amount: number;
  payment_mode: string;
  category: string;
  comment: string;
  created_by: number;
  creator_email?: string;
}

// Sale types
export interface Sale {
  id: number;
  date: string;
  product_id: number;
  quantity: number;
  unit_price: number;
  total: number;
  payment_mode: string;
  client_name: string;
  client_phone: string;
  paid_amount: number;
  balance: number;
  comment: string;
  created_by: number;
  product_code?: string;
  product_name?: string;
  creator_email?: string;
}

// Debtor types
export interface Debtor {
  client_name: string;
  client_phone: string;
  first_date: string;
  last_date: string;
  total_due: number;
  total_balance: number;
  n_sales: number;
}

// Form data types
export interface ProductFormData {
  code: string;
  name: string;
  category: string;
  initial_stock: number;
  min_stock: number;
  unit_price: number;
  purchase_price: number;
  reseller_price: number;
  image_path: string;
}

export interface MovementFormData {
  date: string;
  type: 'ENTREE' | 'SORTIE';
  product_id: number;
  quantity: number;
  unit_price: number | null;
  client_name: string;
  client_phone: string;
  comment: string;
}

export interface ExpenseFormData {
  date: string;
  description: string;
  amount: number;
  payment_mode: string;
  category: string;
  comment: string;
}

export interface SaleFormData {
  date: string;
  product_id: number;
  quantity: number;
  unit_price: number;
  total: number;
  payment_mode: string;
  client_name: string;
  client_phone: string;
  paid_amount: number;
  balance: number;
  comment: string;
}

// Dashboard types
export interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalExpenses: number;
  totalRevenue: number;
  lowStockProducts: number;
  totalDebtors: number;
  totalDebt: number;
}

// Stock calculation types
export interface StockInfo {
  product: Product;
  currentStock: number;
  isLowStock: boolean;
  totalEntries: number;
  totalExits: number;
}