import { Request, Response } from "express";
import { users } from "./auth";
import { ApiResponse } from "../types/database";

// Enhanced user interface with additional fields
interface UserProfile {
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
  created_at: Date;
  updated_at?: Date;
  last_activity?: Date;
}

// Enhanced loan and payment interfaces
interface LoanRecord {
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

interface PaymentRecord {
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

// Mock data with enhanced fields
let userProfiles: UserProfile[] = [
  {
    user_id: 1,
    userNumber: "UN000001",
    userCode: "UC-2024-ADMIN",
    name: "Admin User",
    phone: "01650074073",
    email: "admin@loanbondhu.com",
    role: "admin",
    kycStatus: "verified",
    status: "active",
    created_at: new Date("2023-01-01"),
    last_activity: new Date(),
  },
  {
    user_id: 2,
    userNumber: "UN001234",
    userCode: "UC-2024-001",
    name: "মোহাম্মদ রহিম",
    phone: "01712345678",
    email: "rahim@email.com",
    nid: "1234567890123",
    address: "House 123, Road 5, Dhanmondi, Dhaka-1205",
    dob: new Date("1990-05-15"),
    employment: "Salaried",
    employer: "XYZ Company Ltd",
    monthlyIncome: 45000,
    role: "user",
    kycStatus: "verified",
    status: "active",
    creditScore: 720,
    emergencyContact: {
      name: "ফাতেমা রহিম",
      phone: "01712345679",
      relation: "স্ত্রী"
    },
    bankDetails: {
      bankName: "Dutch Bangla Bank",
      accountNumber: "1234567890",
      branch: "Dhanmondi Branch"
    },
    created_at: new Date("2023-01-15"),
    last_activity: new Date("2024-01-15T10:30:00"),
  },
  {
    user_id: 3,
    userNumber: "UN001235",
    userCode: "UC-2024-002",
    name: "ফাতেমা খাতুন",
    phone: "01987654321",
    email: "fatema@email.com",
    nid: "9876543210987",
    address: "Plot 456, CDA Avenue, Chittagong-4000",
    dob: new Date("1985-08-22"),
    employment: "Business",
    employer: "Own Business",
    monthlyIncome: 35000,
    role: "user",
    kycStatus: "pending",
    status: "active",
    creditScore: 680,
    emergencyContact: {
      name: "আব্দুল করিম",
      phone: "01987654322",
      relation: "স্বামী"
    },
    bankDetails: {
      bankName: "Islami Bank Bangladesh",
      accountNumber: "0987654321",
      branch: "Chittagong Branch"
    },
    created_at: new Date("2023-03-20"),
    last_activity: new Date("2024-01-14T16:45:00"),
  }
];

// Mock loan and payment data
let loanRecords: LoanRecord[] = [
  {
    id: "LN001234",
    userId: 2,
    type: "Salary Loan",
    amount: 100000,
    disbursedDate: new Date("2023-06-01"),
    status: "active",
    emi: 5500,
    remainingBalance: 45000,
    dueDate: new Date("2024-02-01"),
    interestRate: 12.5,
    created_at: new Date("2023-06-01"),
  },
  {
    id: "LN001567",
    userId: 2,
    type: "Instant Microloan",
    amount: 50000,
    disbursedDate: new Date("2023-12-01"),
    status: "active",
    emi: 2800,
    remainingBalance: 35000,
    dueDate: new Date("2024-02-01"),
    interestRate: 15.0,
    created_at: new Date("2023-12-01"),
  },
  {
    id: "LN001890",
    userId: 3,
    type: "Business Microloan",
    amount: 25000,
    disbursedDate: new Date("2023-11-15"),
    status: "active",
    emi: 1500,
    remainingBalance: 15000,
    dueDate: new Date("2024-02-15"),
    interestRate: 14.0,
    created_at: new Date("2023-11-15"),
  }
];

let paymentRecords: PaymentRecord[] = [
  {
    id: "P001",
    userId: 2,
    loanId: "LN001234",
    amount: 5500,
    paymentDate: new Date("2024-01-01"),
    status: "paid",
    method: "bKash",
    transactionId: "BKX123456789",
    created_at: new Date("2024-01-01"),
  },
  {
    id: "P002",
    userId: 2,
    loanId: "LN001567",
    amount: 2800,
    paymentDate: new Date("2024-01-01"),
    status: "paid",
    method: "Bank Transfer",
    transactionId: "BT987654321",
    created_at: new Date("2024-01-01"),
  },
  {
    id: "P003",
    userId: 3,
    loanId: "LN001890",
    amount: 1500,
    paymentDate: new Date("2024-01-05"),
    status: "paid",
    method: "Cash",
    transactionId: "CSH123456",
    created_at: new Date("2024-01-05"),
  }
];

let userIdCounter = 4;
let loanIdCounter = 1891;
let paymentIdCounter = 4;

// GET /api/users - Get all users with search and filters
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      search, 
      searchType = 'all', 
      status, 
      kycStatus, 
      page = 1, 
      limit = 50 
    } = req.query;

    let filtered = [...userProfiles];

    // Apply search filter
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(user => {
        switch (searchType) {
          case 'userNumber':
            return user.userNumber.toLowerCase().includes(searchTerm);
          case 'userCode':
            return user.userCode.toLowerCase().includes(searchTerm);
          case 'name':
            return user.name.toLowerCase().includes(searchTerm);
          case 'phone':
            return user.phone.includes(search);
          default: // 'all'
            return (
              user.userNumber.toLowerCase().includes(searchTerm) ||
              user.userCode.toLowerCase().includes(searchTerm) ||
              user.name.toLowerCase().includes(searchTerm) ||
              user.phone.includes(search) ||
              (user.email && user.email.toLowerCase().includes(searchTerm))
            );
        }
      });
    }

    // Apply status filter
    if (status && status !== 'all') {
      filtered = filtered.filter(user => user.status === status);
    }

    // Apply KYC filter
    if (kycStatus && kycStatus !== 'all') {
      filtered = filtered.filter(user => user.kycStatus === kycStatus);
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    // Add loan and payment summaries to each user
    const usersWithSummary = paginatedUsers.map(user => {
      const userLoans = loanRecords.filter(loan => loan.userId === user.user_id);
      const userPayments = paymentRecords.filter(payment => payment.userId === user.user_id);
      
      const totalLoans = userLoans.length;
      const activeLoanAmount = userLoans
        .filter(loan => loan.status === 'active')
        .reduce((sum, loan) => sum + loan.remainingBalance, 0);
      const totalRepaid = userPayments
        .filter(payment => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        ...user,
        totalLoans,
        activeLoanAmount,
        totalRepaid,
        loans: userLoans,
        payments: userPayments
      };
    });

    res.json({
      success: true,
      data: usersWithSummary,
      pagination: {
        current: pageNum,
        total: Math.ceil(filtered.length / limitNum),
        count: filtered.length,
        showing: paginatedUsers.length
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /api/users/:id - Get single user profile
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = userProfiles.find(u => u.user_id === userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Get user loans and payments
    const userLoans = loanRecords.filter(loan => loan.userId === userId);
    const userPayments = paymentRecords.filter(payment => payment.userId === userId);
    
    const totalLoans = userLoans.length;
    const activeLoanAmount = userLoans
      .filter(loan => loan.status === 'active')
      .reduce((sum, loan) => sum + loan.remainingBalance, 0);
    const totalRepaid = userPayments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const userWithDetails = {
      ...user,
      totalLoans,
      activeLoanAmount,
      totalRepaid,
      loans: userLoans,
      payments: userPayments
    };

    res.json({
      success: true,
      data: userWithDetails
    } as ApiResponse);

  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /api/users/:id - Update user profile
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = req.body;
    
    const userIndex = userProfiles.findIndex(u => u.user_id === userId);
    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Validate phone number if being updated
    if (updateData.phone && updateData.phone !== userProfiles[userIndex].phone) {
      const phoneExists = userProfiles.some(u => u.phone === updateData.phone && u.user_id !== userId);
      if (phoneExists) {
        res.status(409).json({
          success: false,
          message: "Phone number already exists"
        } as ApiResponse);
        return;
      }
    }

    // Validate email if being updated
    if (updateData.email && updateData.email !== userProfiles[userIndex].email) {
      const emailExists = userProfiles.some(u => u.email === updateData.email && u.user_id !== userId);
      if (emailExists) {
        res.status(409).json({
          success: false,
          message: "Email already exists"
        } as ApiResponse);
        return;
      }
    }

    // Update user profile
    userProfiles[userIndex] = {
      ...userProfiles[userIndex],
      ...updateData,
      updated_at: new Date(),
      // Don't allow updating certain fields
      user_id: userProfiles[userIndex].user_id,
      created_at: userProfiles[userIndex].created_at
    };

    // Update last activity
    userProfiles[userIndex].last_activity = new Date();

    // Get updated user with loan/payment details
    const userLoans = loanRecords.filter(loan => loan.userId === userId);
    const userPayments = paymentRecords.filter(payment => payment.userId === userId);
    
    const totalLoans = userLoans.length;
    const activeLoanAmount = userLoans
      .filter(loan => loan.status === 'active')
      .reduce((sum, loan) => sum + loan.remainingBalance, 0);
    const totalRepaid = userPayments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const updatedUser = {
      ...userProfiles[userIndex],
      totalLoans,
      activeLoanAmount,
      totalRepaid,
      loans: userLoans,
      payments: userPayments
    };

    res.json({
      success: true,
      data: updatedUser,
      message: "User profile updated successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// POST /api/users - Create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      phone,
      email,
      nid,
      address,
      dob,
      employment,
      employer,
      monthlyIncome,
      role = "user",
      emergencyContact,
      bankDetails
    } = req.body;

    // Validation
    if (!name || !phone) {
      res.status(400).json({
        success: false,
        message: "Name and phone are required"
      } as ApiResponse);
      return;
    }

    // Check if phone already exists
    const phoneExists = userProfiles.some(u => u.phone === phone);
    if (phoneExists) {
      res.status(409).json({
        success: false,
        message: "Phone number already exists"
      } as ApiResponse);
      return;
    }

    // Check if email already exists (if provided)
    if (email) {
      const emailExists = userProfiles.some(u => u.email === email);
      if (emailExists) {
        res.status(409).json({
          success: false,
          message: "Email already exists"
        } as ApiResponse);
        return;
      }
    }

    // Generate user number and code
    const userNumber = `UN${String(userIdCounter).padStart(6, '0')}`;
    const userCode = `UC-${new Date().getFullYear()}-${String(userIdCounter - 1).padStart(3, '0')}`;

    // Create new user
    const newUser: UserProfile = {
      user_id: userIdCounter++,
      userNumber,
      userCode,
      name,
      phone,
      email,
      nid,
      address,
      dob: dob ? new Date(dob) : undefined,
      employment,
      employer,
      monthlyIncome,
      role,
      kycStatus: "pending",
      status: "active",
      emergencyContact,
      bankDetails,
      created_at: new Date(),
      last_activity: new Date()
    };

    userProfiles.push(newUser);

    const userWithDetails = {
      ...newUser,
      totalLoans: 0,
      activeLoanAmount: 0,
      totalRepaid: 0,
      loans: [],
      payments: []
    };

    res.status(201).json({
      success: true,
      data: userWithDetails,
      message: "User created successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// DELETE /api/users/:id - Delete user (soft delete by changing status)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    const userIndex = userProfiles.findIndex(u => u.user_id === userId);
    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Check if user has active loans
    const activeLoans = loanRecords.filter(loan => 
      loan.userId === userId && loan.status === 'active'
    );
    
    if (activeLoans.length > 0) {
      res.status(400).json({
        success: false,
        message: "Cannot delete user with active loans"
      } as ApiResponse);
      return;
    }

    // Soft delete - change status to inactive
    userProfiles[userIndex].status = "inactive";
    userProfiles[userIndex].updated_at = new Date();

    res.json({
      success: true,
      message: "User deactivated successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /api/users/search/advanced - Advanced search with multiple criteria
export const advancedUserSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      query,
      userNumber,
      userCode,
      name,
      phone,
      email,
      status,
      kycStatus,
      employment,
      minIncome,
      maxIncome,
      minCreditScore,
      maxCreditScore,
      hasActiveLoans,
      page = 1,
      limit = 50
    } = req.query;

    let filtered = [...userProfiles];

    // Global search across all fields
    if (query && typeof query === 'string') {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(user => 
        user.userNumber.toLowerCase().includes(searchTerm) ||
        user.userCode.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.phone.includes(query) ||
        (user.email && user.email.toLowerCase().includes(searchTerm)) ||
        (user.nid && user.nid.includes(query))
      );
    }

    // Specific field searches
    if (userNumber) {
      filtered = filtered.filter(user => 
        user.userNumber.toLowerCase().includes((userNumber as string).toLowerCase())
      );
    }

    if (userCode) {
      filtered = filtered.filter(user => 
        user.userCode.toLowerCase().includes((userCode as string).toLowerCase())
      );
    }

    if (name) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes((name as string).toLowerCase())
      );
    }

    if (phone) {
      filtered = filtered.filter(user => user.phone.includes(phone as string));
    }

    if (email) {
      filtered = filtered.filter(user => 
        user.email && user.email.toLowerCase().includes((email as string).toLowerCase())
      );
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(user => user.status === status);
    }

    if (kycStatus && kycStatus !== 'all') {
      filtered = filtered.filter(user => user.kycStatus === kycStatus);
    }

    if (employment) {
      filtered = filtered.filter(user => 
        user.employment && user.employment.toLowerCase().includes((employment as string).toLowerCase())
      );
    }

    // Income range filter
    if (minIncome) {
      filtered = filtered.filter(user => 
        user.monthlyIncome && user.monthlyIncome >= parseInt(minIncome as string)
      );
    }

    if (maxIncome) {
      filtered = filtered.filter(user => 
        user.monthlyIncome && user.monthlyIncome <= parseInt(maxIncome as string)
      );
    }

    // Credit score range filter
    if (minCreditScore) {
      filtered = filtered.filter(user => 
        user.creditScore && user.creditScore >= parseInt(minCreditScore as string)
      );
    }

    if (maxCreditScore) {
      filtered = filtered.filter(user => 
        user.creditScore && user.creditScore <= parseInt(maxCreditScore as string)
      );
    }

    // Active loans filter
    if (hasActiveLoans === 'true') {
      const usersWithActiveLoans = loanRecords
        .filter(loan => loan.status === 'active')
        .map(loan => loan.userId);
      filtered = filtered.filter(user => usersWithActiveLoans.includes(user.user_id));
    } else if (hasActiveLoans === 'false') {
      const usersWithActiveLoans = loanRecords
        .filter(loan => loan.status === 'active')
        .map(loan => loan.userId);
      filtered = filtered.filter(user => !usersWithActiveLoans.includes(user.user_id));
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    // Add loan and payment summaries
    const usersWithSummary = paginatedUsers.map(user => {
      const userLoans = loanRecords.filter(loan => loan.userId === user.user_id);
      const userPayments = paymentRecords.filter(payment => payment.userId === user.user_id);
      
      const totalLoans = userLoans.length;
      const activeLoanAmount = userLoans
        .filter(loan => loan.status === 'active')
        .reduce((sum, loan) => sum + loan.remainingBalance, 0);
      const totalRepaid = userPayments
        .filter(payment => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        ...user,
        totalLoans,
        activeLoanAmount,
        totalRepaid,
        loans: userLoans,
        payments: userPayments
      };
    });

    res.json({
      success: true,
      data: usersWithSummary,
      pagination: {
        current: pageNum,
        total: Math.ceil(filtered.length / limitNum),
        count: filtered.length,
        showing: paginatedUsers.length
      },
      filters: req.query
    } as ApiResponse);

  } catch (error) {
    console.error("Advanced user search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /api/users/stats - Get user statistics
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = userProfiles.length;
    const activeUsers = userProfiles.filter(u => u.status === 'active').length;
    const kycVerified = userProfiles.filter(u => u.kycStatus === 'verified').length;
    const kycPending = userProfiles.filter(u => u.kycStatus === 'pending').length;
    
    const usersWithActiveLoans = loanRecords
      .filter(loan => loan.status === 'active')
      .map(loan => loan.userId);
    const activeLoansCount = [...new Set(usersWithActiveLoans)].length;

    const totalLoansAmount = loanRecords
      .filter(loan => loan.status === 'active')
      .reduce((sum, loan) => sum + loan.remainingBalance, 0);

    const totalRepaidAmount = paymentRecords
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        kycVerified,
        kycPending,
        kycRejected: totalUsers - kycVerified - kycPending,
        usersWithActiveLoans: activeLoansCount,
        totalActiveLoansAmount: totalLoansAmount,
        totalRepaidAmount,
        averageIncome: userProfiles
          .filter(u => u.monthlyIncome)
          .reduce((sum, u) => sum + (u.monthlyIncome || 0), 0) / 
          userProfiles.filter(u => u.monthlyIncome).length || 0,
        averageCreditScore: userProfiles
          .filter(u => u.creditScore)
          .reduce((sum, u) => sum + (u.creditScore || 0), 0) / 
          userProfiles.filter(u => u.creditScore).length || 0
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// Export data for other modules
export { userProfiles, loanRecords, paymentRecords };
