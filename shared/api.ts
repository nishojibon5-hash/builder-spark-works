/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * User Profile API Types
 */
export interface UserProfile {
  user_id: number;
  userNumber: string;
  userCode: string;
  name: string;
  phone: string;
  email?: string;
  nid?: string;
  address?: string;
  dob?: Date;
  employment?: string;
  employer?: string;
  monthlyIncome?: number;
  role: "admin" | "subadmin" | "editor" | "user";
  kycStatus: "verified" | "pending" | "rejected";
  status: "active" | "inactive" | "suspended";
  creditScore?: number;
  profileImage?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
  totalLoans?: number;
  activeLoanAmount?: number;
  totalRepaid?: number;
  loans?: LoanRecord[];
  payments?: PaymentRecord[];
  created_at: Date;
  updated_at?: Date;
  last_activity?: Date;
}

export interface LoanRecord {
  id: string;
  userId: number;
  type: string;
  amount: number;
  disbursedDate: Date;
  status: "active" | "completed" | "overdue" | "defaulted";
  emi: number;
  remainingBalance: number;
  dueDate: Date;
  interestRate: number;
  created_at: Date;
}

export interface PaymentRecord {
  id: string;
  userId: number;
  loanId: string;
  amount: number;
  paymentDate: Date;
  status: "paid" | "pending" | "failed";
  method: string;
  transactionId?: string;
  created_at: Date;
}

export interface UserSearchParams {
  search?: string;
  searchType?: "all" | "userNumber" | "userCode" | "name" | "phone";
  status?: "all" | "active" | "inactive" | "suspended";
  kycStatus?: "all" | "verified" | "pending" | "rejected";
  page?: number;
  limit?: number;
}

export interface AdvancedUserSearchParams extends UserSearchParams {
  userNumber?: string;
  userCode?: string;
  name?: string;
  phone?: string;
  email?: string;
  employment?: string;
  minIncome?: number;
  maxIncome?: number;
  minCreditScore?: number;
  maxCreditScore?: number;
  hasActiveLoans?: boolean;
}

export interface UserStatsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  kycVerified: number;
  kycPending: number;
  kycRejected: number;
  usersWithActiveLoans: number;
  totalActiveLoansAmount: number;
  totalRepaidAmount: number;
  averageIncome: number;
  averageCreditScore: number;
}

export interface PaginationInfo {
  current: number;
  total: number;
  count: number;
  showing: number;
}
