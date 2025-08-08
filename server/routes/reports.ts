import { Request, Response } from "express";
import { ApiResponse } from "../types/database";
import { users } from "./auth";
import { loans } from "./loans";
import { repayments } from "./repayments";
import { savings, calculateSavingsBalance } from "./savings";
import { kycRecords } from "./kyc";

// Helper function to get date range
const getDateRange = (period: string) => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30); // Default to 30 days
  }
  
  return { startDate, endDate };
};

// GET /reports/loans - Loan disbursement report
export const getLoanReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 'month', loan_type, status } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    let filteredLoans = loans.filter(loan => {
      const loanDate = new Date(loan.applied_at);
      return loanDate >= startDate && loanDate <= endDate;
    });
    
    // Filter by loan type
    if (loan_type && typeof loan_type === 'string') {
      filteredLoans = filteredLoans.filter(l => l.loan_type === loan_type);
    }
    
    // Filter by status
    if (status && typeof status === 'string') {
      filteredLoans = filteredLoans.filter(l => l.status === status);
    }
    
    // Calculate statistics
    const totalApplications = filteredLoans.length;
    const approvedLoans = filteredLoans.filter(l => l.status === 'approved' || l.status === 'disbursed' || l.status === 'completed');
    const disbursedLoans = filteredLoans.filter(l => l.status === 'disbursed' || l.status === 'completed');
    const rejectedLoans = filteredLoans.filter(l => l.status === 'rejected');
    
    const totalDisbursedAmount = disbursedLoans.reduce((sum, l) => sum + l.amount, 0);
    const averageLoanAmount = disbursedLoans.length > 0 ? totalDisbursedAmount / disbursedLoans.length : 0;
    const approvalRate = totalApplications > 0 ? (approvedLoans.length / totalApplications) * 100 : 0;
    
    // Group by loan type
    const loansByType = {
      instant: filteredLoans.filter(l => l.loan_type === 'instant'),
      salary: filteredLoans.filter(l => l.loan_type === 'salary'),
      consumer: filteredLoans.filter(l => l.loan_type === 'consumer'),
      business: filteredLoans.filter(l => l.loan_type === 'business'),
    };
    
    const typeStatistics = Object.entries(loansByType).map(([type, loans]) => ({
      loan_type: type,
      count: loans.length,
      disbursed_amount: loans.filter(l => l.status === 'disbursed' || l.status === 'completed').reduce((sum, l) => sum + l.amount, 0),
      approval_rate: loans.length > 0 ? (loans.filter(l => l.status !== 'pending' && l.status !== 'rejected').length / loans.length) * 100 : 0
    }));
    
    // Daily breakdown
    const dailyBreakdown = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayLoans = filteredLoans.filter(loan => {
        const loanDate = new Date(loan.applied_at);
        return loanDate.toDateString() === currentDate.toDateString();
      });
      
      dailyBreakdown.push({
        date: new Date(currentDate).toISOString().split('T')[0],
        applications: dayLoans.length,
        disbursed: dayLoans.filter(l => l.status === 'disbursed' || l.status === 'completed').length,
        amount: dayLoans.filter(l => l.status === 'disbursed' || l.status === 'completed').reduce((sum, l) => sum + l.amount, 0)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({
      success: true,
      data: {
        summary: {
          period: period,
          date_range: { start: startDate, end: endDate },
          total_applications: totalApplications,
          approved_loans: approvedLoans.length,
          disbursed_loans: disbursedLoans.length,
          rejected_loans: rejectedLoans.length,
          total_disbursed_amount: totalDisbursedAmount,
          average_loan_amount: Math.round(averageLoanAmount),
          approval_rate: Math.round(approvalRate * 100) / 100,
        },
        by_type: typeStatistics,
        daily_breakdown: dailyBreakdown,
        loans: filteredLoans.map(loan => {
          const user = users.find(u => u.user_id === loan.user_id);
          return {
            ...loan,
            user_name: user?.name,
            user_phone: user?.phone,
          };
        })
      }
    } as ApiResponse);
    
  } catch (error) {
    console.error("Get loan report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /reports/repayments - Repayment report
export const getRepaymentReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 'month', payment_method, status } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    let filteredRepayments = repayments.filter(repayment => {
      const paymentDate = new Date(repayment.payment_date);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
    
    // Filter by payment method
    if (payment_method && typeof payment_method === 'string') {
      filteredRepayments = filteredRepayments.filter(r => r.payment_method === payment_method);
    }
    
    // Filter by status
    if (status && typeof status === 'string') {
      filteredRepayments = filteredRepayments.filter(r => r.status === status);
    }
    
    // Calculate statistics
    const totalRepayments = filteredRepayments.length;
    const totalAmount = filteredRepayments.reduce((sum, r) => sum + r.amount_paid, 0);
    const totalLateFees = filteredRepayments.reduce((sum, r) => sum + (r.late_fee || 0), 0);
    const averageRepayment = totalRepayments > 0 ? totalAmount / totalRepayments : 0;
    
    // Group by payment method
    const paymentMethods = ['bKash', 'Nagad', 'Rocket', 'Bank', 'Card', 'Cash'];
    const methodStatistics = paymentMethods.map(method => {
      const methodRepayments = filteredRepayments.filter(r => r.payment_method === method);
      return {
        payment_method: method,
        count: methodRepayments.length,
        amount: methodRepayments.reduce((sum, r) => sum + r.amount_paid, 0),
        percentage: totalAmount > 0 ? (methodRepayments.reduce((sum, r) => sum + r.amount_paid, 0) / totalAmount) * 100 : 0
      };
    }).filter(stat => stat.count > 0);
    
    // Calculate collection efficiency
    const onTimePayments = filteredRepayments.filter(r => (r.late_fee || 0) === 0).length;
    const latePayments = filteredRepayments.filter(r => (r.late_fee || 0) > 0).length;
    const collectionEfficiency = totalRepayments > 0 ? (onTimePayments / totalRepayments) * 100 : 0;
    
    // Daily breakdown
    const dailyBreakdown = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayRepayments = filteredRepayments.filter(repayment => {
        const paymentDate = new Date(repayment.payment_date);
        return paymentDate.toDateString() === currentDate.toDateString();
      });
      
      dailyBreakdown.push({
        date: new Date(currentDate).toISOString().split('T')[0],
        count: dayRepayments.length,
        amount: dayRepayments.reduce((sum, r) => sum + r.amount_paid, 0),
        late_fees: dayRepayments.reduce((sum, r) => sum + (r.late_fee || 0), 0)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({
      success: true,
      data: {
        summary: {
          period: period,
          date_range: { start: startDate, end: endDate },
          total_repayments: totalRepayments,
          total_amount: totalAmount,
          total_late_fees: totalLateFees,
          average_repayment: Math.round(averageRepayment),
          on_time_payments: onTimePayments,
          late_payments: latePayments,
          collection_efficiency: Math.round(collectionEfficiency * 100) / 100,
        },
        by_payment_method: methodStatistics,
        daily_breakdown: dailyBreakdown,
        repayments: filteredRepayments.map(repayment => {
          const user = users.find(u => u.user_id === repayment.user_id);
          const loan = loans.find(l => l.loan_id === repayment.loan_id);
          return {
            ...repayment,
            user_name: user?.name,
            user_phone: user?.phone,
            loan_type: loan?.loan_type,
          };
        })
      }
    } as ApiResponse);
    
  } catch (error) {
    console.error("Get repayment report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /reports/savings - Savings report
export const getSavingsReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 'month', transaction_type } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    let filteredSavings = savings.filter(saving => {
      const savingDate = new Date(saving.date);
      return savingDate >= startDate && savingDate <= endDate;
    });
    
    // Filter by transaction type
    if (transaction_type && typeof transaction_type === 'string') {
      filteredSavings = filteredSavings.filter(s => s.transaction_type === transaction_type);
    }
    
    // Calculate statistics
    const totalTransactions = filteredSavings.length;
    const deposits = filteredSavings.filter(s => s.transaction_type === 'deposit');
    const withdrawals = filteredSavings.filter(s => s.transaction_type === 'withdrawal');
    
    const totalDeposits = deposits.reduce((sum, s) => sum + s.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, s) => sum + s.amount, 0);
    const netFlow = totalDeposits - totalWithdrawals;
    
    // Calculate current balances for all users
    const userBalances = users.map(user => ({
      user_id: user.user_id,
      user_name: user.name,
      user_phone: user.phone,
      balance: calculateSavingsBalance(user.user_id)
    })).filter(u => u.balance > 0).sort((a, b) => b.balance - a.balance);
    
    const totalSavingsBalance = userBalances.reduce((sum, u) => sum + u.balance, 0);
    const activeSavers = userBalances.length;
    const averageBalance = activeSavers > 0 ? totalSavingsBalance / activeSavers : 0;
    
    // Daily breakdown
    const dailyBreakdown = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const daySavings = filteredSavings.filter(saving => {
        const savingDate = new Date(saving.date);
        return savingDate.toDateString() === currentDate.toDateString();
      });
      
      const dayDeposits = daySavings.filter(s => s.transaction_type === 'deposit').reduce((sum, s) => sum + s.amount, 0);
      const dayWithdrawals = daySavings.filter(s => s.transaction_type === 'withdrawal').reduce((sum, s) => sum + s.amount, 0);
      
      dailyBreakdown.push({
        date: new Date(currentDate).toISOString().split('T')[0],
        transactions: daySavings.length,
        deposits: dayDeposits,
        withdrawals: dayWithdrawals,
        net_flow: dayDeposits - dayWithdrawals
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({
      success: true,
      data: {
        summary: {
          period: period,
          date_range: { start: startDate, end: endDate },
          total_transactions: totalTransactions,
          total_deposits: totalDeposits,
          total_withdrawals: totalWithdrawals,
          net_flow: netFlow,
          current_total_balance: totalSavingsBalance,
          active_savers: activeSavers,
          average_balance: Math.round(averageBalance),
        },
        top_savers: userBalances.slice(0, 10),
        daily_breakdown: dailyBreakdown,
        transactions: filteredSavings.map(saving => {
          const user = users.find(u => u.user_id === saving.user_id);
          return {
            ...saving,
            user_name: user?.name,
            user_phone: user?.phone,
          };
        })
      }
    } as ApiResponse);
    
  } catch (error) {
    console.error("Get savings report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /reports/portfolio - Portfolio analysis report
export const getPortfolioReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    // Portfolio composition
    const activeLoans = loans.filter(l => l.status === 'disbursed');
    const totalPortfolioValue = activeLoans.reduce((sum, l) => sum + l.amount, 0);
    
    // Risk analysis
    const today = new Date();
    let overdueAmount = 0;
    let overdueCount = 0;
    
    for (const loan of activeLoans) {
      const loanRepayments = repayments.filter(r => r.loan_id === loan.loan_id && r.status === 'completed');
      const nextEmiNumber = loanRepayments.length + 1;
      
      if (nextEmiNumber <= loan.tenure_months && loan.disbursed_at) {
        const dueDate = new Date(loan.disbursed_at);
        dueDate.setMonth(dueDate.getMonth() + nextEmiNumber - 1);
        
        if (dueDate < today) {
          overdueAmount += loan.monthly_emi;
          overdueCount++;
        }
      }
    }
    
    const portfolioAtRisk = totalPortfolioValue > 0 ? (overdueAmount / totalPortfolioValue) * 100 : 0;
    
    // Performance metrics
    const completedLoans = loans.filter(l => l.status === 'completed');
    const totalRepaid = repayments.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount_paid, 0);
    const totalDisbursed = loans.filter(l => l.status === 'disbursed' || l.status === 'completed').reduce((sum, l) => sum + l.amount, 0);
    
    const recoveryRate = totalDisbursed > 0 ? (totalRepaid / totalDisbursed) * 100 : 0;
    
    // Loan performance by type
    const loanTypes = ['instant', 'salary', 'consumer', 'business'];
    const performanceByType = loanTypes.map(type => {
      const typeLoans = activeLoans.filter(l => l.loan_type === type);
      const typeValue = typeLoans.reduce((sum, l) => sum + l.amount, 0);
      const typeOverdue = typeLoans.filter(loan => {
        const loanRepayments = repayments.filter(r => r.loan_id === loan.loan_id && r.status === 'completed');
        const nextEmiNumber = loanRepayments.length + 1;
        
        if (nextEmiNumber <= loan.tenure_months && loan.disbursed_at) {
          const dueDate = new Date(loan.disbursed_at);
          dueDate.setMonth(dueDate.getMonth() + nextEmiNumber - 1);
          return dueDate < today;
        }
        return false;
      }).length;
      
      return {
        loan_type: type,
        count: typeLoans.length,
        portfolio_value: typeValue,
        portfolio_percentage: totalPortfolioValue > 0 ? (typeValue / totalPortfolioValue) * 100 : 0,
        overdue_count: typeOverdue,
        risk_percentage: typeLoans.length > 0 ? (typeOverdue / typeLoans.length) * 100 : 0
      };
    }).filter(p => p.count > 0);
    
    res.json({
      success: true,
      data: {
        portfolio_overview: {
          total_active_loans: activeLoans.length,
          total_portfolio_value: totalPortfolioValue,
          portfolio_at_risk_percentage: Math.round(portfolioAtRisk * 100) / 100,
          overdue_loans: overdueCount,
          overdue_amount: overdueAmount,
          recovery_rate: Math.round(recoveryRate * 100) / 100,
        },
        performance_by_type: performanceByType,
        risk_metrics: {
          low_risk_loans: activeLoans.filter(l => l.amount <= 50000).length,
          medium_risk_loans: activeLoans.filter(l => l.amount > 50000 && l.amount <= 200000).length,
          high_risk_loans: activeLoans.filter(l => l.amount > 200000).length,
          total_loans: activeLoans.length
        },
        collection_metrics: {
          total_disbursed: totalDisbursed,
          total_repaid: totalRepaid,
          outstanding_amount: totalDisbursed - totalRepaid,
          collection_efficiency: Math.round(recoveryRate * 100) / 100
        }
      }
    } as ApiResponse);
    
  } catch (error) {
    console.error("Get portfolio report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /reports/export - Export data as CSV/PDF
export const exportReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, format = 'csv', period = 'month' } = req.query;
    
    if (!type || !['loans', 'repayments', 'savings', 'portfolio'].includes(type as string)) {
      res.status(400).json({
        success: false,
        message: "Invalid report type"
      } as ApiResponse);
      return;
    }
    
    if (!['csv', 'pdf', 'excel'].includes(format as string)) {
      res.status(400).json({
        success: false,
        message: "Invalid export format"
      } as ApiResponse);
      return;
    }
    
    // In a real application, this would generate actual CSV/PDF files
    // For now, we'll return the data structure that would be exported
    
    let exportData: any = {};
    const { startDate, endDate } = getDateRange(period as string);
    
    switch (type) {
      case 'loans':
        exportData = {
          filename: `loan_report_${period}_${new Date().toISOString().split('T')[0]}.${format}`,
          headers: ['Loan ID', 'User Name', 'Phone', 'Loan Type', 'Amount', 'Status', 'Applied Date', 'Approved Date'],
          data: loans.filter(l => {
            const loanDate = new Date(l.applied_at);
            return loanDate >= startDate && loanDate <= endDate;
          }).map(loan => {
            const user = users.find(u => u.user_id === loan.user_id);
            return [
              loan.loan_id,
              user?.name || '',
              user?.phone || '',
              loan.loan_type,
              loan.amount,
              loan.status,
              loan.applied_at.toISOString().split('T')[0],
              loan.approved_at?.toISOString().split('T')[0] || ''
            ];
          })
        };
        break;
        
      case 'repayments':
        exportData = {
          filename: `repayment_report_${period}_${new Date().toISOString().split('T')[0]}.${format}`,
          headers: ['Repayment ID', 'Loan ID', 'User Name', 'Phone', 'Amount', 'Payment Method', 'Payment Date', 'Late Fee'],
          data: repayments.filter(r => {
            const paymentDate = new Date(r.payment_date);
            return paymentDate >= startDate && paymentDate <= endDate;
          }).map(repayment => {
            const user = users.find(u => u.user_id === repayment.user_id);
            return [
              repayment.repayment_id,
              repayment.loan_id,
              user?.name || '',
              user?.phone || '',
              repayment.amount_paid,
              repayment.payment_method,
              repayment.payment_date.toISOString().split('T')[0],
              repayment.late_fee || 0
            ];
          })
        };
        break;
        
      case 'savings':
        exportData = {
          filename: `savings_report_${period}_${new Date().toISOString().split('T')[0]}.${format}`,
          headers: ['Saving ID', 'User Name', 'Phone', 'Amount', 'Transaction Type', 'Date', 'Description'],
          data: savings.filter(s => {
            const savingDate = new Date(s.date);
            return savingDate >= startDate && savingDate <= endDate;
          }).map(saving => {
            const user = users.find(u => u.user_id === saving.user_id);
            return [
              saving.saving_id,
              user?.name || '',
              user?.phone || '',
              saving.amount,
              saving.transaction_type,
              saving.date.toISOString().split('T')[0],
              saving.description || ''
            ];
          })
        };
        break;
        
      case 'portfolio':
        const activeLoans = loans.filter(l => l.status === 'disbursed');
        exportData = {
          filename: `portfolio_report_${period}_${new Date().toISOString().split('T')[0]}.${format}`,
          headers: ['Loan ID', 'User Name', 'Phone', 'Loan Type', 'Amount', 'EMI', 'Tenure', 'Disbursed Date', 'Status'],
          data: activeLoans.map(loan => {
            const user = users.find(u => u.user_id === loan.user_id);
            return [
              loan.loan_id,
              user?.name || '',
              user?.phone || '',
              loan.loan_type,
              loan.amount,
              loan.monthly_emi,
              loan.tenure_months,
              loan.disbursed_at?.toISOString().split('T')[0] || '',
              loan.status
            ];
          })
        };
        break;
    }
    
    res.json({
      success: true,
      data: exportData,
      message: `${type} report exported successfully`
    } as ApiResponse);
    
  } catch (error) {
    console.error("Export report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};

// GET /reports/analytics - Advanced analytics data
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    // Growth metrics
    const currentPeriodLoans = loans.filter(l => {
      const loanDate = new Date(l.applied_at);
      return loanDate >= startDate && loanDate <= endDate;
    });
    
    const previousPeriodStart = new Date(startDate);
    const previousPeriodEnd = new Date(endDate);
    const periodDiff = endDate.getTime() - startDate.getTime();
    previousPeriodStart.setTime(previousPeriodStart.getTime() - periodDiff);
    previousPeriodEnd.setTime(previousPeriodEnd.getTime() - periodDiff);
    
    const previousPeriodLoans = loans.filter(l => {
      const loanDate = new Date(l.applied_at);
      return loanDate >= previousPeriodStart && loanDate <= previousPeriodEnd;
    });
    
    const loanGrowthRate = previousPeriodLoans.length > 0 
      ? ((currentPeriodLoans.length - previousPeriodLoans.length) / previousPeriodLoans.length) * 100 
      : 0;
    
    // Customer acquisition
    const newCustomers = users.filter(u => {
      const userDate = new Date(u.created_at);
      return userDate >= startDate && userDate <= endDate;
    }).length;
    
    // Revenue analytics
    const interestEarned = repayments.filter(r => {
      const paymentDate = new Date(r.payment_date);
      return paymentDate >= startDate && paymentDate <= endDate;
    }).reduce((sum, r) => {
      const loan = loans.find(l => l.loan_id === r.loan_id);
      if (loan) {
        const interestPortion = (loan.monthly_emi * loan.interest_rate / 100) / 12;
        return sum + interestPortion;
      }
      return sum;
    }, 0);
    
    res.json({
      success: true,
      data: {
        growth_metrics: {
          loan_applications_growth: Math.round(loanGrowthRate * 100) / 100,
          new_customers: newCustomers,
          portfolio_growth: 15.5, // Mock data
          revenue_growth: 22.3, // Mock data
        },
        customer_metrics: {
          total_customers: users.filter(u => u.role === 'user').length,
          active_borrowers: loans.filter(l => l.status === 'disbursed').map(l => l.user_id).filter((v, i, a) => a.indexOf(v) === i).length,
          repeat_customers: 45, // Mock data
          customer_satisfaction: 4.2, // Mock data
        },
        financial_metrics: {
          total_revenue: interestEarned,
          interest_earned: interestEarned,
          processing_fees: 12500, // Mock data
          late_fees: repayments.reduce((sum, r) => sum + (r.late_fee || 0), 0),
        },
        operational_metrics: {
          average_approval_time: 2.5, // days
          disbursement_efficiency: 95.2, // percentage
          collection_efficiency: 92.8, // percentage
          kyc_completion_rate: (kycRecords.filter(k => k.status === 'verified').length / kycRecords.length) * 100,
        }
      }
    } as ApiResponse);
    
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as ApiResponse);
  }
};
