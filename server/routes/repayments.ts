import { Request, Response } from "express";
import { Repayment, RepaymentRequest, ApiResponse } from "../types/database";
import { users } from "./auth";
import { loans } from "./loans";

// Mock repayments database
let repayments: Repayment[] = [
  {
    repayment_id: 1,
    loan_id: 1,
    user_id: 2,
    amount_paid: 7125,
    payment_method: "bKash",
    payment_date: new Date("2024-01-15"),
    transaction_reference: "TXN123456789",
    late_fee: 0,
    emi_number: 1,
    status: "completed",
    recorded_by: 1,
    created_at: new Date("2024-01-15"),
  }
];

let repaymentIdCounter = 2;

// Calculate late fee (2% of EMI amount per day, max 10% of EMI)
const calculateLateFee = (emiAmount: number, daysLate: number): number => {
  if (daysLate <= 0) return 0;
  const dailyFee = emiAmount * 0.02; // 2% per day
  const totalFee = dailyFee * daysLate;
  const maxFee = emiAmount * 0.1; // Maximum 10% of EMI
  return Math.min(totalFee, maxFee);
};

// Get days between two dates
const getDaysDifference = (date1: Date, date2: Date): number => {
  const timeDiff = date2.getTime() - date1.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Calculate next EMI due date
const getNextEMIDueDate = (loanDisbursedDate: Date, emiNumber: number): Date => {
  const dueDate = new Date(loanDisbursedDate);
  dueDate.setMonth(dueDate.getMonth() + emiNumber);
  return dueDate;
};

// POST /repayments/add - Add a repayment entry
export const addRepayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const recorderId = (req as any).userId;
    const { 
      loan_id, 
      amount_paid, 
      payment_method, 
      payment_date, 
      transaction_reference 
    }: RepaymentRequest = req.body;

    // Validation
    if (!loan_id || !amount_paid || !payment_method || !payment_date) {
      res.status(400).json({
        success: false,
        message: "Loan ID, amount, payment method, and date are required"
      } as ApiResponse);
      return;
    }

    // Find loan
    const loan = loans.find(l => l.loan_id === loan_id);
    if (!loan) {
      res.status(404).json({
        success: false,
        message: "Loan not found"
      } as ApiResponse);
      return;
    }

    // Check if loan is disbursed
    if (loan.status !== "disbursed") {
      res.status(400).json({
        success: false,
        message: "Can only add repayments for disbursed loans"
      } as ApiResponse);
      return;
    }

    // Calculate which EMI this payment is for
    const existingRepayments = repayments.filter(r => r.loan_id === loan_id && r.status === "completed");
    const nextEmiNumber = existingRepayments.length + 1;

    if (nextEmiNumber > loan.tenure_months) {
      res.status(400).json({
        success: false,
        message: "All EMIs for this loan have been paid"
      } as ApiResponse);
      return;
    }

    // Calculate due date for this EMI
    const dueDate = getNextEMIDueDate(loan.disbursed_at!, nextEmiNumber - 1);
    const paymentDateObj = new Date(payment_date);
    const daysLate = getDaysDifference(dueDate, paymentDateObj);
    
    // Calculate late fee if payment is late
    const lateFee = calculateLateFee(loan.monthly_emi, daysLate);

    // Validate payment amount (should be at least EMI amount + late fee)
    const totalAmountDue = loan.monthly_emi + lateFee;
    if (amount_paid < totalAmountDue) {
      res.status(400).json({
        success: false,
        message: `Insufficient payment. Amount due: ৳${totalAmountDue.toLocaleString()} (EMI: ৳${loan.monthly_emi.toLocaleString()}, Late Fee: ৳${lateFee.toLocaleString()})`
      } as ApiResponse);
      return;
    }

    // Create repayment record
    const newRepayment: Repayment = {
      repayment_id: repaymentIdCounter++,
      loan_id,
      user_id: loan.user_id,
      amount_paid,
      payment_method: payment_method as any,
      payment_date: paymentDateObj,
      transaction_reference,
      late_fee: lateFee,
      emi_number: nextEmiNumber,
      status: "completed",
      recorded_by: recorderId,
      created_at: new Date(),
    };

    repayments.push(newRepayment);

    // Check if loan is fully paid
    const totalRepayments = repayments.filter(r => r.loan_id === loan_id && r.status === "completed").length;
    if (totalRepayments >= loan.tenure_months) {
      // Update loan status to completed
      const loanIndex = loans.findIndex(l => l.loan_id === loan_id);
      if (loanIndex !== -1) {
        loans[loanIndex].status = "completed";
        loans[loanIndex].updated_at = new Date();
      }
    }

    // Log the payment
    console.log(`Repayment added: Loan ${loan_id}, EMI ${nextEmiNumber}, Amount: ৳${amount_paid}`);

    res.status(201).json({
      success: true,
      data: newRepayment,
      message: "Repayment recorded successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Add repayment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /repayments/user/:userId - Get repayment history of a user
export const getUserRepayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const requesterId = (req as any).userId;
    const requesterRole = (req as any).userRole;

    // Users can only view their own repayments, admins can view any
    if (parseInt(userId) !== requesterId && requesterRole !== 'admin' && requesterRole !== 'subadmin') {
      res.status(403).json({
        success: false,
        message: "Access denied"
      } as ApiResponse);
      return;
    }

    const userRepayments = repayments.filter(r => r.user_id === parseInt(userId));

    // Add loan details to repayments
    const repaymentsWithLoans = userRepayments.map(repayment => {
      const loan = loans.find(l => l.loan_id === repayment.loan_id);
      return {
        ...repayment,
        loan_type: loan?.loan_type,
        loan_amount: loan?.amount,
      };
    });

    // Sort by payment date (newest first)
    repaymentsWithLoans.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

    res.json({
      success: true,
      data: repaymentsWithLoans
    } as ApiResponse);

  } catch (error) {
    console.error("Get user repayments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /repayments/loan/:loanId - Get repayment history for a loan
export const getLoanRepayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    // Find loan
    const loan = loans.find(l => l.loan_id === parseInt(loanId));
    if (!loan) {
      res.status(404).json({
        success: false,
        message: "Loan not found"
      } as ApiResponse);
      return;
    }

    // Users can only view their own loan repayments, admins can view any
    if (loan.user_id !== userId && userRole !== 'admin' && userRole !== 'subadmin') {
      res.status(403).json({
        success: false,
        message: "Access denied"
      } as ApiResponse);
      return;
    }

    const loanRepayments = repayments.filter(r => r.loan_id === parseInt(loanId));

    // Generate EMI schedule with payment status
    const emiSchedule = [];
    for (let emiNumber = 1; emiNumber <= loan.tenure_months; emiNumber++) {
      const dueDate = getNextEMIDueDate(loan.disbursed_at!, emiNumber - 1);
      const payment = loanRepayments.find(r => r.emi_number === emiNumber && r.status === "completed");
      
      emiSchedule.push({
        emi_number: emiNumber,
        due_date: dueDate,
        emi_amount: loan.monthly_emi,
        status: payment ? "paid" : (dueDate < new Date() ? "overdue" : "pending"),
        payment_date: payment?.payment_date,
        amount_paid: payment?.amount_paid,
        late_fee: payment?.late_fee || 0,
        payment_method: payment?.payment_method,
        transaction_reference: payment?.transaction_reference,
      });
    }

    res.json({
      success: true,
      data: {
        loan_details: loan,
        emi_schedule: emiSchedule,
        total_paid: loanRepayments.reduce((sum, r) => sum + r.amount_paid, 0),
        remaining_emis: loan.tenure_months - loanRepayments.filter(r => r.status === "completed").length,
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get loan repayments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /repayments/update/:repaymentId - Update repayment record
export const updateRepayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { repaymentId } = req.params;
    const adminId = (req as any).userId;
    const { amount_paid, payment_method, payment_date, transaction_reference, status } = req.body;

    const repaymentIndex = repayments.findIndex(r => r.repayment_id === parseInt(repaymentId));
    if (repaymentIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Repayment record not found"
      } as ApiResponse);
      return;
    }

    // Update repayment
    if (amount_paid) repayments[repaymentIndex].amount_paid = amount_paid;
    if (payment_method) repayments[repaymentIndex].payment_method = payment_method;
    if (payment_date) repayments[repaymentIndex].payment_date = new Date(payment_date);
    if (transaction_reference) repayments[repaymentIndex].transaction_reference = transaction_reference;
    if (status) repayments[repaymentIndex].status = status;
    
    repayments[repaymentIndex].updated_at = new Date();

    // Log admin action
    console.log(`Admin ${adminId} updated repayment ${repaymentId}`);

    res.json({
      success: true,
      data: repayments[repaymentIndex],
      message: "Repayment updated successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Update repayment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /repayments/all - Admin gets all repayments
export const getAllRepayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, payment_method, page = 1, limit = 10, search } = req.query;
    
    let filteredRepayments = [...repayments];
    
    // Filter by status
    if (status && typeof status === 'string') {
      filteredRepayments = filteredRepayments.filter(r => r.status === status);
    }
    
    // Filter by payment method
    if (payment_method && typeof payment_method === 'string') {
      filteredRepayments = filteredRepayments.filter(r => r.payment_method === payment_method);
    }
    
    // Search filter
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredRepayments = filteredRepayments.filter(repayment => {
        const user = users.find(u => u.user_id === repayment.user_id);
        const loan = loans.find(l => l.loan_id === repayment.loan_id);
        return (
          repayment.repayment_id.toString().includes(searchTerm) ||
          repayment.loan_id.toString().includes(searchTerm) ||
          user?.name.toLowerCase().includes(searchTerm) ||
          user?.phone.includes(searchTerm) ||
          repayment.transaction_reference?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Sort by payment date (newest first)
    filteredRepayments.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedRepayments = filteredRepayments.slice(startIndex, endIndex);

    // Add user and loan details
    const repaymentsWithDetails = paginatedRepayments.map(repayment => {
      const user = users.find(u => u.user_id === repayment.user_id);
      const loan = loans.find(l => l.loan_id === repayment.loan_id);
      return {
        ...repayment,
        user_name: user?.name,
        user_phone: user?.phone,
        loan_type: loan?.loan_type,
        loan_amount: loan?.amount,
      };
    });

    res.json({
      success: true,
      data: repaymentsWithDetails,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredRepayments.length,
        totalPages: Math.ceil(filteredRepayments.length / limitNum)
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get all repayments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /repayments/overdue - Get overdue payments
export const getOverduePayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const overdueList = [];
    
    // Check all disbursed loans for overdue payments
    const disbursedLoans = loans.filter(l => l.status === "disbursed");
    
    for (const loan of disbursedLoans) {
      const loanRepayments = repayments.filter(r => r.loan_id === loan.loan_id && r.status === "completed");
      const nextEmiNumber = loanRepayments.length + 1;
      
      if (nextEmiNumber <= loan.tenure_months) {
        const dueDate = getNextEMIDueDate(loan.disbursed_at!, nextEmiNumber - 1);
        const today = new Date();
        
        if (dueDate < today) {
          const daysOverdue = getDaysDifference(dueDate, today);
          const lateFee = calculateLateFee(loan.monthly_emi, daysOverdue);
          const user = users.find(u => u.user_id === loan.user_id);
          
          overdueList.push({
            loan_id: loan.loan_id,
            user_id: loan.user_id,
            user_name: user?.name,
            user_phone: user?.phone,
            loan_type: loan.loan_type,
            emi_number: nextEmiNumber,
            emi_amount: loan.monthly_emi,
            due_date: dueDate,
            days_overdue: daysOverdue,
            late_fee: lateFee,
            total_amount_due: loan.monthly_emi + lateFee,
          });
        }
      }
    }

    // Sort by days overdue (highest first)
    overdueList.sort((a, b) => b.days_overdue - a.days_overdue);

    res.json({
      success: true,
      data: overdueList,
      total_overdue: overdueList.length,
      total_overdue_amount: overdueList.reduce((sum, item) => sum + item.total_amount_due, 0)
    } as ApiResponse);

  } catch (error) {
    console.error("Get overdue payments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// Export repayments for other modules
export { repayments };
