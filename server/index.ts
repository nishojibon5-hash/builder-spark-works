import "dotenv/config";
import express from "express";
import cors from "cors";

// Import route handlers
import { handleDemo } from "./routes/demo";
import { 
  login, 
  adminLogin, 
  logout, 
  register, 
  getProfile, 
  updateProfile, 
  authenticateToken, 
  requireAdmin 
} from "./routes/auth";
import { 
  uploadKYC, 
  getKYCStatus, 
  verifyKYC, 
  rejectKYC, 
  getAllKYC 
} from "./routes/kyc";
import { 
  applyLoan, 
  getUserLoans, 
  getLoanDetails, 
  updateLoanStatus, 
  editLoan, 
  getAllLoans,
  getLoanConfig
} from "./routes/loans";
import { 
  addRepayment, 
  getUserRepayments, 
  getLoanRepayments, 
  updateRepayment, 
  getAllRepayments,
  getOverduePayments
} from "./routes/repayments";
import { 
  addSavings, 
  getUserSavings, 
  updateSavings, 
  getAllSavings,
  getSavingsSummary
} from "./routes/savings";
import {
  addUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAuditLogs,
  getSystemHealth
} from "./routes/admin";
import {
  getUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser as deleteUserProfile,
  advancedUserSearch,
  getUserStats
} from "./routes/users";
import { 
  getLoanReport, 
  getRepaymentReport, 
  getSavingsReport, 
  getPortfolioReport, 
  exportReport,
  getAnalytics
} from "./routes/reports";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoints
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ success: true, message: ping, timestamp: new Date().toISOString() });
  });

  app.get("/api/demo", handleDemo);

  // Auth & User Management Routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/admin-login", adminLogin);
  app.post("/api/auth/logout", authenticateToken, logout);
  app.post("/api/auth/register", register);
  app.get("/api/auth/profile", authenticateToken, getProfile);
  app.put("/api/auth/profile", authenticateToken, updateProfile);

  // KYC Verification Routes
  app.post("/api/kyc/upload", authenticateToken, uploadKYC);
  app.get("/api/kyc/status/:userId", authenticateToken, getKYCStatus);
  app.put("/api/kyc/verify/:userId", authenticateToken, requireAdmin, verifyKYC);
  app.put("/api/kyc/reject/:userId", authenticateToken, requireAdmin, rejectKYC);
  app.get("/api/kyc/all", authenticateToken, requireAdmin, getAllKYC);

  // Loan Management Routes
  app.post("/api/loans/apply", authenticateToken, applyLoan);
  app.get("/api/loans/user/:userId", authenticateToken, getUserLoans);
  app.get("/api/loans/:loanId", authenticateToken, getLoanDetails);
  app.put("/api/loans/update-status/:loanId", authenticateToken, requireAdmin, updateLoanStatus);
  app.put("/api/loans/edit/:loanId", authenticateToken, requireAdmin, editLoan);
  app.get("/api/loans/all", authenticateToken, requireAdmin, getAllLoans);
  app.get("/api/loans/config", getLoanConfig);

  // Repayment Routes
  app.post("/api/repayments/add", authenticateToken, requireAdmin, addRepayment);
  app.get("/api/repayments/user/:userId", authenticateToken, getUserRepayments);
  app.get("/api/repayments/loan/:loanId", authenticateToken, getLoanRepayments);
  app.put("/api/repayments/update/:repaymentId", authenticateToken, requireAdmin, updateRepayment);
  app.get("/api/repayments/all", authenticateToken, requireAdmin, getAllRepayments);
  app.get("/api/repayments/overdue", authenticateToken, requireAdmin, getOverduePayments);

  // Savings Routes
  app.post("/api/savings/add", authenticateToken, addSavings);
  app.get("/api/savings/user/:userId", authenticateToken, getUserSavings);
  app.put("/api/savings/update/:savingId", authenticateToken, requireAdmin, updateSavings);
  app.get("/api/savings/all", authenticateToken, requireAdmin, getAllSavings);
  app.get("/api/savings/summary", authenticateToken, requireAdmin, getSavingsSummary);

  // Admin Panel Management Routes
  app.post("/api/admin/users/add", authenticateToken, requireAdmin, addUser);
  app.get("/api/admin/users", authenticateToken, requireAdmin, getAllUsers);
  app.put("/api/admin/users/update-role/:userId", authenticateToken, requireAdmin, updateUserRole);
  app.delete("/api/admin/users/delete/:userId", authenticateToken, requireAdmin, deleteUser);
  app.get("/api/admin/dashboard", authenticateToken, requireAdmin, getDashboardStats);
  app.get("/api/admin/audit-logs", authenticateToken, requireAdmin, getAuditLogs);
  app.get("/api/admin/system-health", authenticateToken, requireAdmin, getSystemHealth);

  // Reports & Analytics Routes
  app.get("/api/reports/loans", authenticateToken, requireAdmin, getLoanReport);
  app.get("/api/reports/repayments", authenticateToken, requireAdmin, getRepaymentReport);
  app.get("/api/reports/savings", authenticateToken, requireAdmin, getSavingsReport);
  app.get("/api/reports/portfolio", authenticateToken, requireAdmin, getPortfolioReport);
  app.get("/api/reports/export", authenticateToken, requireAdmin, exportReport);
  app.get("/api/reports/analytics", authenticateToken, requireAdmin, getAnalytics);

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.path}`
    });
  });

  return app;
}
