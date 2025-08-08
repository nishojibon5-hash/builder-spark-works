import { Request, Response } from "express";
import { Savings, SavingsRequest, ApiResponse } from "../types/database";
import { users } from "./auth";

// Mock savings database
let savings: Savings[] = [
  {
    saving_id: 1,
    user_id: 2,
    amount: 5000,
    transaction_type: "deposit",
    date: new Date("2024-01-10"),
    description: "Monthly savings deposit",
    recorded_by: 1,
    created_at: new Date("2024-01-10"),
  },
  {
    saving_id: 2,
    user_id: 2,
    amount: 2000,
    transaction_type: "withdrawal",
    date: new Date("2024-01-20"),
    description: "Emergency withdrawal",
    recorded_by: 1,
    created_at: new Date("2024-01-20"),
  }
];

let savingsIdCounter = 3;

// Calculate user's total savings balance
const calculateSavingsBalance = (userId: number): number => {
  const userSavings = savings.filter(s => s.user_id === userId);
  let balance = 0;
  
  for (const saving of userSavings) {
    if (saving.transaction_type === "deposit") {
      balance += saving.amount;
    } else if (saving.transaction_type === "withdrawal") {
      balance -= saving.amount;
    }
  }
  
  return balance;
};

// POST /savings/add - Add a savings entry
export const addSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const recorderId = (req as any).userId;
    const requesterRole = (req as any).userRole;
    const { amount, transaction_type, date, description, user_id } = req.body;

    // Validation
    if (!amount || !transaction_type || !date) {
      res.status(400).json({
        success: false,
        message: "Amount, transaction type, and date are required"
      } as ApiResponse);
      return;
    }

    if (!["deposit", "withdrawal"].includes(transaction_type)) {
      res.status(400).json({
        success: false,
        message: "Transaction type must be 'deposit' or 'withdrawal'"
      } as ApiResponse);
      return;
    }

    if (amount <= 0) {
      res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      } as ApiResponse);
      return;
    }

    // Determine target user ID
    let targetUserId: number;
    
    if (requesterRole === 'admin' || requesterRole === 'subadmin') {
      // Admin can add savings for any user
      if (!user_id) {
        res.status(400).json({
          success: false,
          message: "User ID is required for admin operations"
        } as ApiResponse);
        return;
      }
      targetUserId = user_id;
    } else {
      // Regular users can only add to their own savings
      targetUserId = recorderId;
    }

    // Check if target user exists
    const targetUser = users.find(u => u.user_id === targetUserId);
    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: "Target user not found"
      } as ApiResponse);
      return;
    }

    // For withdrawals, check if user has sufficient balance
    if (transaction_type === "withdrawal") {
      const currentBalance = calculateSavingsBalance(targetUserId);
      if (currentBalance < amount) {
        res.status(400).json({
          success: false,
          message: `Insufficient balance. Available: ৳${currentBalance.toLocaleString()}`
        } as ApiResponse);
        return;
      }
    }

    // Create savings record
    const newSavings: Savings = {
      saving_id: savingsIdCounter++,
      user_id: targetUserId,
      amount,
      transaction_type,
      date: new Date(date),
      description: description || "",
      recorded_by: recorderId,
      created_at: new Date(),
    };

    savings.push(newSavings);

    // Calculate new balance
    const newBalance = calculateSavingsBalance(targetUserId);

    // Log the transaction
    console.log(`Savings ${transaction_type}: User ${targetUserId}, Amount: ৳${amount}, New Balance: ৳${newBalance}`);

    res.status(201).json({
      success: true,
      data: {
        ...newSavings,
        new_balance: newBalance
      },
      message: `Savings ${transaction_type} recorded successfully`
    } as ApiResponse);

  } catch (error) {
    console.error("Add savings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /savings/user/:userId - Get savings history of a user
export const getUserSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const requesterId = (req as any).userId;
    const requesterRole = (req as any).userRole;

    // Users can only view their own savings, admins can view any
    if (parseInt(userId) !== requesterId && requesterRole !== 'admin' && requesterRole !== 'subadmin') {
      res.status(403).json({
        success: false,
        message: "Access denied"
      } as ApiResponse);
      return;
    }

    // Check if user exists
    const user = users.find(u => u.user_id === parseInt(userId));
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      } as ApiResponse);
      return;
    }

    const userSavings = savings.filter(s => s.user_id === parseInt(userId));

    // Sort by date (newest first)
    userSavings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate balance and statistics
    const currentBalance = calculateSavingsBalance(parseInt(userId));
    const totalDeposits = userSavings
      .filter(s => s.transaction_type === "deposit")
      .reduce((sum, s) => sum + s.amount, 0);
    const totalWithdrawals = userSavings
      .filter(s => s.transaction_type === "withdrawal")
      .reduce((sum, s) => sum + s.amount, 0);

    res.json({
      success: true,
      data: {
        user_info: {
          user_id: user.user_id,
          name: user.name,
          phone: user.phone,
        },
        current_balance: currentBalance,
        total_deposits: totalDeposits,
        total_withdrawals: totalWithdrawals,
        transaction_count: userSavings.length,
        transactions: userSavings,
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get user savings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// PUT /savings/update/:savingId - Update savings record
export const updateSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { savingId } = req.params;
    const adminId = (req as any).userId;
    const { amount, transaction_type, date, description } = req.body;

    const savingsIndex = savings.findIndex(s => s.saving_id === parseInt(savingId));
    if (savingsIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Savings record not found"
      } as ApiResponse);
      return;
    }

    const originalSaving = { ...savings[savingsIndex] };

    // Update savings record
    if (amount !== undefined) savings[savingsIndex].amount = amount;
    if (transaction_type) savings[savingsIndex].transaction_type = transaction_type;
    if (date) savings[savingsIndex].date = new Date(date);
    if (description !== undefined) savings[savingsIndex].description = description;
    
    savings[savingsIndex].updated_at = new Date();

    // Validate the update doesn't create negative balance
    if (amount !== undefined || transaction_type !== undefined) {
      const newBalance = calculateSavingsBalance(savings[savingsIndex].user_id);
      if (newBalance < 0) {
        // Revert changes
        savings[savingsIndex] = originalSaving;
        res.status(400).json({
          success: false,
          message: "Update would result in negative balance"
        } as ApiResponse);
        return;
      }
    }

    // Log admin action
    console.log(`Admin ${adminId} updated savings record ${savingId}`);

    res.json({
      success: true,
      data: savings[savingsIndex],
      message: "Savings record updated successfully"
    } as ApiResponse);

  } catch (error) {
    console.error("Update savings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /savings/all - Admin gets all savings records
export const getAllSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transaction_type, page = 1, limit = 10, search } = req.query;
    
    let filteredSavings = [...savings];
    
    // Filter by transaction type
    if (transaction_type && typeof transaction_type === 'string') {
      filteredSavings = filteredSavings.filter(s => s.transaction_type === transaction_type);
    }
    
    // Search filter
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredSavings = filteredSavings.filter(saving => {
        const user = users.find(u => u.user_id === saving.user_id);
        return (
          saving.saving_id.toString().includes(searchTerm) ||
          user?.name.toLowerCase().includes(searchTerm) ||
          user?.phone.includes(searchTerm) ||
          saving.description?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Sort by date (newest first)
    filteredSavings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedSavings = filteredSavings.slice(startIndex, endIndex);

    // Add user details
    const savingsWithUsers = paginatedSavings.map(saving => {
      const user = users.find(u => u.user_id === saving.user_id);
      return {
        ...saving,
        user_name: user?.name,
        user_phone: user?.phone,
        user_balance: calculateSavingsBalance(saving.user_id),
      };
    });

    res.json({
      success: true,
      data: savingsWithUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredSavings.length,
        totalPages: Math.ceil(filteredSavings.length / limitNum)
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get all savings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /savings/summary - Get savings summary statistics
export const getSavingsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalDeposits = savings
      .filter(s => s.transaction_type === "deposit")
      .reduce((sum, s) => sum + s.amount, 0);

    const totalWithdrawals = savings
      .filter(s => s.transaction_type === "withdrawal")
      .reduce((sum, s) => sum + s.amount, 0);

    const totalBalance = totalDeposits - totalWithdrawals;

    // Get active savers (users with positive balance)
    const userBalances = new Map<number, number>();
    for (const user of users) {
      userBalances.set(user.user_id, calculateSavingsBalance(user.user_id));
    }

    const activeSavers = Array.from(userBalances.values()).filter(balance => balance > 0).length;
    const averageBalance = activeSavers > 0 ? totalBalance / activeSavers : 0;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTransactions = savings.filter(s => s.date >= thirtyDaysAgo);
    const recentDeposits = recentTransactions
      .filter(s => s.transaction_type === "deposit")
      .reduce((sum, s) => sum + s.amount, 0);
    const recentWithdrawals = recentTransactions
      .filter(s => s.transaction_type === "withdrawal")
      .reduce((sum, s) => sum + s.amount, 0);

    res.json({
      success: true,
      data: {
        total_balance: totalBalance,
        total_deposits: totalDeposits,
        total_withdrawals: totalWithdrawals,
        active_savers: activeSavers,
        average_balance: Math.round(averageBalance),
        recent_activity: {
          deposits_30d: recentDeposits,
          withdrawals_30d: recentWithdrawals,
          net_flow_30d: recentDeposits - recentWithdrawals,
          transaction_count_30d: recentTransactions.length,
        }
      }
    } as ApiResponse);

  } catch (error) {
    console.error("Get savings summary error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// Export savings for other modules
export { savings, calculateSavingsBalance };
