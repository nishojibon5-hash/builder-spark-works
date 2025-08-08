// Database Schema Types for Bangladesh Loan Application System

export interface User {
  user_id: number;
  name: string;
  phone: string; // Unique
  password_hash: string;
  role: 'admin' | 'subadmin' | 'editor' | 'user';
  dob: Date;
  address: string;
  created_at: Date;
  updated_at?: Date;
}

export interface KYC {
  kyc_id: number;
  user_id: number;
  document_type: 'NID' | 'Passport' | 'License';
  document_number: string;
  document_image_url: string;
  document_image_back_url?: string;
  status: 'pending' | 'verified' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface Loan {
  loan_id: number;
  user_id: number;
  loan_type: 'instant' | 'salary' | 'consumer' | 'business';
  amount: number;
  interest_rate: number;
  tenure_months: number;
  monthly_emi: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  applied_at: Date;
  approved_by?: number;
  approved_at?: Date;
  disbursed_at?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface Repayment {
  repayment_id: number;
  loan_id: number;
  user_id: number;
  amount_paid: number;
  payment_method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Card' | 'Cash';
  payment_date: Date;
  transaction_reference?: string;
  late_fee?: number;
  emi_number: number;
  status: 'pending' | 'completed' | 'failed';
  recorded_by: number;
  created_at: Date;
  updated_at?: Date;
}

export interface Savings {
  saving_id: number;
  user_id: number;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal';
  date: Date;
  description?: string;
  recorded_by: number;
  created_at: Date;
  updated_at?: Date;
}

export interface AuditLog {
  log_id: number;
  admin_id: number;
  action: string;
  entity_type: 'user' | 'loan' | 'repayment' | 'kyc' | 'savings';
  entity_id: number;
  old_values?: string; // JSON string
  new_values?: string; // JSON string
  ip_address?: string;
  timestamp: Date;
}

// Request/Response Types
export interface LoginRequest {
  phone: string;
  password?: string;
  otp?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password_hash'>;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  password: string;
  dob: string;
  address: string;
}

export interface LoanApplicationRequest {
  loan_type: 'instant' | 'salary' | 'consumer' | 'business';
  amount: number;
  tenure_months: number;
  purpose: string;
  monthly_income: number;
  employment_type: string;
  employer_name?: string;
}

export interface KYCUploadRequest {
  document_type: 'NID' | 'Passport' | 'License';
  document_number: string;
  front_image: string; // Base64 or file path
  back_image?: string; // Base64 or file path
}

export interface RepaymentRequest {
  loan_id: number;
  amount_paid: number;
  payment_method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Card' | 'Cash';
  payment_date: string;
  transaction_reference?: string;
}

export interface SavingsRequest {
  amount: number;
  transaction_type: 'deposit' | 'withdrawal';
  date: string;
  description?: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_users: number;
  total_loans: number;
  total_disbursed: number;
  total_repayments: number;
  pending_kyc: number;
  pending_loans: number;
  overdue_payments: number;
  collection_rate: number;
  portfolio_at_risk: number;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database connection interface
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: 'mysql' | 'postgresql' | 'sqlite';
}
