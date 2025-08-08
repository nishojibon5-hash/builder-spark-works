import { Request, Response } from "express";
import { Loan, LoanApplicationRequest, ApiResponse } from "../types/database";
import { users } from "./auth";
import { kycRecords } from "./kyc";

// Mock loans database
let loans: Loan[] = [
  {
    loan_id: 1,
    user_id: 2,
    loan_type: "salary",
    amount: 150000,
    interest_rate: 15,
    tenure_months: 24,
    monthly_emi: 7125,
    purpose: "Home renovation and medical expenses",
    status: "disbursed",
    applied_at: new Date("2024-01-01"),
    approved_by: 1,
    approved_at: new Date("2024-01-02"),
    disbursed_at: new Date("2024-01-03"),
    created_at: new Date("2024-01-01"),
  }
];

let loanIdCounter = 2;

// Loan type configurations
const loanConfigs = {
  instant: {
    min_amount: 5000,
    max_amount: 50000,
    min_tenure: 1,
    max_tenure: 12,
    interest_rate: 18,
  },
  salary: {
    min_amount: 50000,
    max_amount: 1000000,
    min_tenure: 12,
    max_tenure: 60,
    interest_rate: 15,
  },
  consumer: {
    min_amount: 100000,
    max_amount: 2000000,
    min_tenure: 24,
    max_tenure: 84,
    interest_rate: 16,
  },
  business: {
    min_amount: 25000,
    max_amount: 500000,
    min_tenure: 6,
    max_tenure: 36,
    interest_rate: 20,
  },
};

// Calculate EMI
const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

// Check loan eligibility
const checkEligibility = (
  amount: number, 
  monthlyIncome: number, 
  loanType: keyof typeof loanConfigs,
  userAge: number
): { eligible: boolean; reason?: string } => {
  const config = loanConfigs[loanType];
  
  // Age check
  if (userAge < 21 || userAge > 60) {
    return { eligible: false, reason: "Age must be between 21-60 years" };
  }
  
  // Amount check
  if (amount < config.min_amount || amount > config.max_amount) {
    return { 
      eligible: false, 
      reason: `Amount must be between ৳${config.min_amount.toLocaleString()} - ৳${config.max_amount.toLocaleString()}` 
    };
  }
  
  // Income check (EMI should not exceed 50% of monthly income)
  const emi = calculateEMI(amount, config.interest_rate, config.min_tenure);
  if (emi > monthlyIncome * 0.5) {
    return { 
      eligible: false, 
      reason: `Monthly EMI (৳${emi.toLocaleString()}) exceeds 50% of income` 
    };
  }
  
  return { eligible: true };
};

// POST /loans/apply - Apply for a loan
export const applyLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { 
      loan_type, 
      amount, 
      tenure_months, 
      purpose, 
      monthly_income, 
      employment_type, 
      employer_name 
    }: LoanApplicationRequest = req.body;

    // Validation
    if (!loan_type || !amount || !tenure_months || !purpose || !monthly_income) {
      res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      } as ApiResponse);
      return;
    }

    // Check if user exists
    const user = users.find(u => u.user_id === userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    // Check KYC status
    const kycRecord = kycRecords.find(k => k.user_id === userId);
    if (!kycRecord || kycRecord.status !== "verified") {
      res.status(403).json({
        success: false,
        message: "KYC verification required before loan application"
      } as ApiResponse);
      return;
    }

    // Check if user has any pending loan applications
    const pendingLoan = loans.find(l => l.user_id === userId && l.status === "pending");
    if (pendingLoan) {
      res.status(409).json({
        success: false,
        message: "You already have a pending loan application"
      } as ApiResponse);
      return;
    }

    // Validate loan type
    if (!loanConfigs[loan_type as keyof typeof loanConfigs]) {
      res.status(400).json({
        success: false,
        message: "Invalid loan type"
      } as ApiResponse);
      return;
    }

    const config = loanConfigs[loan_type as keyof typeof loanConfigs];

    // Validate tenure
    if (tenure_months < config.min_tenure || tenure_months > config.max_tenure) {
      res.status(400).json({
        success: false,
        message: `Tenure must be between ${config.min_tenure}-${config.max_tenure} months`
      } as ApiResponse);
      return;
    }

    // Calculate user age
    const userAge = new Date().getFullYear() - user.dob.getFullYear();

    // Check eligibility
    const eligibility = checkEligibility(amount, monthly_income, loan_type as keyof typeof loanConfigs, userAge);
    if (!eligibility.eligible) {
      res.status(400).json({
        success: false,
        message: eligibility.reason
      } as ApiResponse);
      return;
    }

    // Calculate EMI
    const monthly_emi = calculateEMI(amount, config.interest_rate, tenure_months);

    // Create loan application
    const newLoan: Loan = {
      loan_id: loanIdCounter++,
      user_id: userId,
      loan_type: loan_type as any,
      amount,
      interest_rate: config.interest_rate,
      tenure_months,
      monthly_emi,
      purpose,
      status: "pending",
      applied_at: new Date(),
      created_at: new Date(),
    };

    loans.push(newLoan);

    res.status(201).json({
      success: true,
      data: newLoan,
      message: "Loan application submitted successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Apply loan error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /loans/user/:userId - Get all loans for a user
export const getUserLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const requesterId = (req as any).userId;
    const requesterRole = (req as any).userRole;

    // Users can only view their own loans, admins can view any
    if (parseInt(userId) !== requesterId && requesterRole !== 'admin' && requesterRole !== 'subadmin') {
      res.status(403).json({
        success: false,
        message: "Access denied"
      } as ApiResponse);
      return;
    }

    const userLoans = loans.filter(l => l.user_id === parseInt(userId));

    res.json({
      success: true,
      data: userLoans
    } as ApiResponse);

  } catch (error) {
    console.error("Get user loans error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /loans/:loanId - Get loan details
export const getLoanDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const loan = loans.find(l => l.loan_id === parseInt(loanId));
    if (!loan) {
      res.status(404).json({
        success: false,
        message: "Loan not found"
      } as ApiResponse);
      return;
    }

    // Users can only view their own loans, admins can view any
    if (loan.user_id !== userId && userRole !== 'admin' && userRole !== 'subadmin') {
      res.status(403).json({
        success: false,
        message: "Access denied"
      } as ApiResponse);
      return;
    }

    // Add user details
    const user = users.find(u => u.user_id === loan.user_id);
    const loanWithUser = {
      ...loan,
      user_name: user?.name,
      user_phone: user?.phone,
    };

    res.json({
      success: true,
      data: loanWithUser
    } as ApiResponse);

  } catch (error) {
    console.error("Get loan details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /loans/update-status/:loanId - Admin updates loan status
export const updateLoanStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const adminId = (req as any).userId;
    const { status, rejection_reason, approved_amount } = req.body;

    const validStatuses = ["pending", "approved", "rejected", "disbursed", "completed"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status"
      } as ApiResponse);
      return;
    }

    const loanIndex = loans.findIndex(l => l.loan_id === parseInt(loanId));
    if (loanIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Loan not found"
      } as ApiResponse);
      return;
    }

    const loan = loans[loanIndex];

    // Status transition validation
    if (loan.status === "disbursed" && status === "pending") {
      res.status(400).json({
        success: false,
        message: "Cannot change disbursed loan back to pending"
      } as ApiResponse);
      return;
    }

    if (status === "rejected" && !rejection_reason) {
      res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      } as ApiResponse);
      return;
    }

    // Update loan
    loans[loanIndex].status = status;
    loans[loanIndex].updated_at = new Date();

    if (status === "approved") {
      loans[loanIndex].approved_by = adminId;
      loans[loanIndex].approved_at = new Date();
      
      // Update amount if modified
      if (approved_amount && approved_amount !== loan.amount) {
        loans[loanIndex].amount = approved_amount;
        loans[loanIndex].monthly_emi = calculateEMI(
          approved_amount, 
          loan.interest_rate, 
          loan.tenure_months
        );
      }
    } else if (status === "rejected") {
      loans[loanIndex].rejection_reason = rejection_reason;
    } else if (status === "disbursed") {
      loans[loanIndex].disbursed_at = new Date();
    }

    // Log admin action
    console.log(`Admin ${adminId} updated loan ${loanId} status to ${status}`);

    res.json({
      success: true,
      data: loans[loanIndex],
      message: `Loan ${status} successfully`
    } as ApiResponse);

  } catch (error) {
    console.error("Update loan status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /loans/edit/:loanId - Admin edits loan details
export const editLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const adminId = (req as any).userId;
    const { amount, interest_rate, tenure_months, purpose } = req.body;

    const loanIndex = loans.findIndex(l => l.loan_id === parseInt(loanId));
    if (loanIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Loan not found"
      } as ApiResponse);
      return;
    }

    const loan = loans[loanIndex];

    // Only allow editing pending or approved loans
    if (!["pending", "approved"].includes(loan.status)) {
      res.status(400).json({
        success: false,
        message: "Cannot edit loan in current status"
      } as ApiResponse);
      return;
    }

    // Update loan details
    if (amount) {
      loans[loanIndex].amount = amount;
    }
    if (interest_rate) {
      loans[loanIndex].interest_rate = interest_rate;
    }
    if (tenure_months) {
      loans[loanIndex].tenure_months = tenure_months;
    }
    if (purpose) {
      loans[loanIndex].purpose = purpose;
    }

    // Recalculate EMI if amount, rate, or tenure changed
    if (amount || interest_rate || tenure_months) {
      loans[loanIndex].monthly_emi = calculateEMI(
        loans[loanIndex].amount,
        loans[loanIndex].interest_rate,
        loans[loanIndex].tenure_months
      );
    }

    loans[loanIndex].updated_at = new Date();

    // Log admin action
    console.log(`Admin ${adminId} edited loan ${loanId}`);

    res.json({
      success: true,
      data: loans[loanIndex],
      message: "Loan updated successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Edit loan error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /loans/all - Admin gets all loan applications
export const getAllLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, loan_type, page = 1, limit = 10, search } = req.query;
    
    let filteredLoans = [...loans];
    
    // Filter by status
    if (status && typeof status === 'string') {
      filteredLoans = filteredLoans.filter(l => l.status === status);
    }
    
    // Filter by loan type
    if (loan_type && typeof loan_type === 'string') {
      filteredLoans = filteredLoans.filter(l => l.loan_type === loan_type);
    }
    
    // Search filter
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredLoans = filteredLoans.filter(loan => {
        const user = users.find(u => u.user_id === loan.user_id);
        return (
          loan.loan_id.toString().includes(searchTerm) ||
          user?.name.toLowerCase().includes(searchTerm) ||
          user?.phone.includes(searchTerm) ||
          loan.purpose.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Sort by application date (newest first)
    filteredLoans.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime());

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedLoans = filteredLoans.slice(startIndex, endIndex);

    // Add user details to loans
    const loansWithUsers = paginatedLoans.map(loan => {
      const user = users.find(u => u.user_id === loan.user_id);
      return {
        ...loan,
        user_name: user?.name,
        user_phone: user?.phone,
        user_email: user?.phone + "@example.com", // Mock email
      };
    });

    res.json({
      success: true,
      data: loansWithUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredLoans.length,
        totalPages: Math.ceil(filteredLoans.length / limitNum)
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get all loans error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /loans/config - Get loan configurations
export const getLoanConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: loanConfigs
    } as ApiResponse);
  } catch (error) {
    console.error("Get loan config error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// Export loans for other modules
export { loans, loanConfigs };
