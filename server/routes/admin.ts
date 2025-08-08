import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, DashboardStats, ApiResponse } from "../types/database";
import { users } from "./auth";
import { loans } from "./loans";
import { repayments } from "./repayments";
import { savings, calculateSavingsBalance } from "./savings";
import { kycRecords } from "./kyc";

// POST /admin/users/add - Add new user/subadmin/editor
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).userId;
    const { name, phone, password, role = "user", dob, address } = req.body;

    // Validation
    if (!name || !phone || !password) {
      res.status(400).json({
        success: false,
        message: "Name, phone, and password are required"
      } as ApiResponse);
      return;
    }

    // Validate role
    const validRoles = ["admin", "subadmin", "editor", "user"];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role"
      } as ApiResponse);
      return;
    }

    // Check if phone already exists
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Phone number already exists"
      } as ApiResponse);
      return;
    }

    // Validate phone number format
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400).json({
        success: false,
        message: "Invalid Bangladesh phone number format"
      } as ApiResponse);
      return;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      user_id: Math.max(...users.map(u => u.user_id)) + 1,
      name,
      phone,
      password_hash,
      role: role as any,
      dob: dob ? new Date(dob) : new Date(),
      address: address || "",
      created_at: new Date(),
    };

    users.push(newUser);

    // Log admin action
    console.log(`Admin ${adminId} created new ${role}: ${name} (${phone})`);

    const { password_hash: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`
    } as ApiResponse);

  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /admin/users - List all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    
    let filteredUsers = [...users];
    
    // Filter by role
    if (role && typeof role === 'string') {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }
    
    // Search filter
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.phone.includes(searchTerm) ||
        user.user_id.toString().includes(searchTerm)
      );
    }

    // Sort by created date (newest first)
    filteredUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Remove password hashes and add additional info
    const usersWithStats = paginatedUsers.map(user => {
      const { password_hash, ...userWithoutPassword } = user;
      
      // Get user statistics
      const userLoans = loans.filter(l => l.user_id === user.user_id);
      const userRepayments = repayments.filter(r => r.user_id === user.user_id);
      const savingsBalance = calculateSavingsBalance(user.user_id);
      const kycStatus = kycRecords.find(k => k.user_id === user.user_id)?.status || "not_submitted";
      
      return {
        ...userWithoutPassword,
        stats: {
          total_loans: userLoans.length,
          active_loans: userLoans.filter(l => l.status === "disbursed").length,
          total_repayments: userRepayments.length,
          savings_balance: savingsBalance,
          kyc_status: kycStatus,
        }
      };
    });

    res.json({
      success: true,
      data: usersWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limitNum)
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /admin/users/update-role/:userId - Update user role
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const adminId = (req as any).userId;
    const { role } = req.body;

    // Validation
    const validRoles = ["admin", "subadmin", "editor", "user"];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role"
      } as ApiResponse);
      return;
    }

    const userIndex = users.findIndex(u => u.user_id === parseInt(userId));
    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Prevent changing the main admin (01650074073)
    if (users[userIndex].phone === "01650074073" && role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Cannot change main admin role"
      } as ApiResponse);
      return;
    }

    const oldRole = users[userIndex].role;
    users[userIndex].role = role;
    users[userIndex].updated_at = new Date();

    // Log admin action
    console.log(`Admin ${adminId} changed user ${userId} role from ${oldRole} to ${role}`);

    const { password_hash, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      data: userWithoutPassword,
      message: `User role updated to ${role}`
    } as ApiResponse);

  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// DELETE /admin/users/delete/:userId - Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const adminId = (req as any).userId;

    const userIndex = users.findIndex(u => u.user_id === parseInt(userId));
    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Prevent deleting the main admin
    if (users[userIndex].phone === "01650074073") {
      res.status(403).json({
        success: false,
        message: "Cannot delete main admin"
      } as ApiResponse);
      return;
    }

    // Check if user has active loans
    const activeLoans = loans.filter(l => l.user_id === parseInt(userId) && l.status === "disbursed");
    if (activeLoans.length > 0) {
      res.status(400).json({
        success: false,
        message: "Cannot delete user with active loans"
      } as ApiResponse);
      return;
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    // Log admin action
    console.log(`Admin ${adminId} deleted user ${userId}: ${deletedUser.name}`);

    res.json({
      success: true,
      message: "User deleted successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /admin/dashboard - Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Calculate dashboard statistics
    const totalUsers = users.filter(u => u.role === "user").length;
    const totalLoans = loans.length;
    const totalDisbursed = loans
      .filter(l => l.status === "disbursed" || l.status === "completed")
      .reduce((sum, l) => sum + l.amount, 0);
    const totalRepayments = repayments
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + r.amount_paid, 0);
    
    // KYC statistics
    const pendingKYC = kycRecords.filter(k => k.status === "pending").length;
    const verifiedKYC = kycRecords.filter(k => k.status === "verified").length;
    
    // Loan statistics
    const pendingLoans = loans.filter(l => l.status === "pending").length;
    const approvedLoans = loans.filter(l => l.status === "approved").length;
    const disbursedLoans = loans.filter(l => l.status === "disbursed").length;
    const rejectedLoans = loans.filter(l => l.status === "rejected").length;
    
    // Calculate overdue payments
    const today = new Date();
    let overduePayments = 0;
    let overdueAmount = 0;
    
    const activeLoansList = loans.filter(l => l.status === "disbursed");
    for (const loan of activeLoansList) {
      const loanRepayments = repayments.filter(r => r.loan_id === loan.loan_id && r.status === "completed");
      const nextEmiNumber = loanRepayments.length + 1;
      
      if (nextEmiNumber <= loan.tenure_months && loan.disbursed_at) {
        const dueDate = new Date(loan.disbursed_at);
        dueDate.setMonth(dueDate.getMonth() + nextEmiNumber - 1);
        
        if (dueDate < today) {
          overduePayments++;
          overdueAmount += loan.monthly_emi;
        }
      }
    }
    
    // Calculate collection rate
    const totalEMIsDue = disbursedLoans * 12; // Simplified calculation
    const totalEMIsPaid = repayments.filter(r => r.status === "completed").length;
    const collectionRate = totalEMIsDue > 0 ? (totalEMIsPaid / totalEMIsDue) * 100 : 0;
    
    // Calculate portfolio at risk (simplified)
    const portfolioAtRisk = totalDisbursed > 0 ? (overdueAmount / totalDisbursed) * 100 : 0;
    
    // Savings statistics
    const totalSavingsBalance = users.reduce((sum, user) => sum + calculateSavingsBalance(user.user_id), 0);
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLoans = loans.filter(l => l.applied_at >= sevenDaysAgo).length;
    const recentRepayments = repayments.filter(r => r.created_at >= sevenDaysAgo).length;
    const recentKYC = kycRecords.filter(k => k.created_at >= sevenDaysAgo).length;
    
    const dashboardStats: DashboardStats = {
      total_users: totalUsers,
      total_loans: totalLoans,
      total_disbursed: totalDisbursed,
      total_repayments: totalRepayments,
      pending_kyc: pendingKYC,
      pending_loans: pendingLoans,
      overdue_payments: overduePayments,
      collection_rate: Math.round(collectionRate * 100) / 100,
      portfolio_at_risk: Math.round(portfolioAtRisk * 100) / 100,
    };

    const extendedStats = {
      ...dashboardStats,
      kyc_stats: {
        pending: pendingKYC,
        verified: verifiedKYC,
        total: kycRecords.length,
      },
      loan_stats: {
        pending: pendingLoans,
        approved: approvedLoans,
        disbursed: disbursedLoans,
        rejected: rejectedLoans,
        total: totalLoans,
      },
      repayment_stats: {
        total_amount: totalRepayments,
        overdue_count: overduePayments,
        overdue_amount: overdueAmount,
        on_time_percentage: Math.max(0, 100 - portfolioAtRisk),
      },
      savings_stats: {
        total_balance: totalSavingsBalance,
        active_savers: users.filter(u => calculateSavingsBalance(u.user_id) > 0).length,
      },
      recent_activity: {
        new_loans_7d: recentLoans,
        new_repayments_7d: recentRepayments,
        new_kyc_7d: recentKYC,
      }
    };

    res.json({
      success: true,
      data: extendedStats
    } as ApiResponse);

  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /admin/audit-logs - Get admin audit logs
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, admin_id, action_type } = req.query;
    
    // In a real application, this would fetch from audit_logs table
    // For now, we'll return a mock structure
    const mockAuditLogs = [
      {
        log_id: 1,
        admin_id: 1,
        admin_name: "Admin User",
        action: "Updated loan status",
        entity_type: "loan",
        entity_id: 1,
        old_values: '{"status": "pending"}',
        new_values: '{"status": "approved"}',
        ip_address: "192.168.1.1",
        timestamp: new Date(),
      },
      {
        log_id: 2,
        admin_id: 1,
        admin_name: "Admin User",
        action: "Verified KYC",
        entity_type: "kyc",
        entity_id: 1,
        old_values: '{"status": "pending"}',
        new_values: '{"status": "verified"}',
        ip_address: "192.168.1.1",
        timestamp: new Date(),
      }
    ];

    res.json({
      success: true,
      data: mockAuditLogs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: mockAuditLogs.length,
        totalPages: 1
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get audit logs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /admin/system-health - Get system health status
export const getSystemHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    const systemHealth = {
      status: "healthy",
      database: {
        status: "connected",
        response_time: "< 100ms"
      },
      api: {
        status: "operational",
        uptime: "99.9%"
      },
      storage: {
        status: "operational",
        usage: "65%"
      },
      alerts: [
        {
          type: "info",
          message: "System maintenance scheduled for next Sunday",
          timestamp: new Date()
        }
      ],
      last_backup: new Date(),
      version: "1.0.0"
    };

    res.json({
      success: true,
      data: systemHealth
    } as ApiResponse);

  } catch (error) {
    console.error("Get system health error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};
