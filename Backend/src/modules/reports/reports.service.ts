import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import {
  UserReport,
  LoanReport,
  TransactionReport,
  RevenueReport,
  DashboardAnalytics,
} from './interfaces/reports.interface';

@Injectable()
export class ReportsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getUsersReport(): Promise<{ success: boolean; data: UserReport }> {
    try {
      const db = this.firebaseService.db;
      const usersSnapshot = await db.collection('users').get();

      let totalUsers = 0;
      let activeUsers = 0;
      let suspendedUsers = 0;
      let borrowers = 0;
      let lenders = 0;
      let admins = 0;
      let newUsersThisMonth = 0;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        totalUsers++;

        // Count by status
        if (user.status === 'active') activeUsers++;
        if (user.status === 'suspended') suspendedUsers++;

        // Count by role
        if (user.role === 'borrower') borrowers++;
        if (user.role === 'lender') lenders++;
        if (user.role === 'admin') admins++;

        // Count new users this month
        if (user.createdAt) {
          const createdDate = user.createdAt.toDate();
          if (
            createdDate.getMonth() === currentMonth &&
            createdDate.getFullYear() === currentYear
          ) {
            newUsersThisMonth++;
          }
        }
      });

      return {
        success: true,
        data: {
          totalUsers,
          activeUsers,
          suspendedUsers,
          borrowers,
          lenders,
          newUsersThisMonth,
          usersByRole: {
            admin: admins,
            borrower: borrowers,
            lender: lenders,
          },
          usersByStatus: {
            active: activeUsers,
            suspended: suspendedUsers,
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate users report: ${error.message}`);
    }
  }

  async getLoansReport(): Promise<{ success: boolean; data: LoanReport }> {
    try {
      const db = this.firebaseService.db;
      const adsSnapshot = await db.collection('ads').get();

      let totalLoans = 0;
      let activeLoans = 0;
      let completedLoans = 0;
      let pendingLoans = 0;
      let approvedLoans = 0;
      let rejectedLoans = 0;
      let totalAmount = 0;

      adsSnapshot.forEach((doc) => {
        const ad = doc.data();
        totalLoans++;

        if (ad.status === 'active') activeLoans++;
        if (ad.status === 'approved') approvedLoans++;
        if (ad.status === 'rejected') rejectedLoans++;
        if (ad.status === 'pending') pendingLoans++;
        if (ad.status === 'closed') completedLoans++;

        if (ad.amount) {
          totalAmount += ad.amount;
        }
      });

      const averageLoanAmount = totalLoans > 0 ? totalAmount / totalLoans : 0;

      return {
        success: true,
        data: {
          totalLoans,
          activeLoans,
          completedLoans,
          defaultedLoans: 0, // Would need separate collection for defaults
          totalLoanAmount: totalAmount,
          averageLoanAmount: Math.round(averageLoanAmount * 100) / 100,
          pendingApprovals: pendingLoans,
          loansByStatus: {
            pending: pendingLoans,
            approved: approvedLoans,
            active: activeLoans,
            rejected: rejectedLoans,
            completed: completedLoans,
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate loans report: ${error.message}`);
    }
  }

  async getTransactionsReport(): Promise<{
    success: boolean;
    data: TransactionReport;
  }> {
    try {
      const db = this.firebaseService.db;
      const txnSnapshot = await db.collection('transactions').get();

      let totalTransactions = 0;
      let successfulTransactions = 0;
      let failedTransactions = 0;
      let pendingTransactions = 0;
      let totalVolume = 0;
      const transactionsByType: { [key: string]: number } = {};

      txnSnapshot.forEach((doc) => {
        const txn = doc.data();
        totalTransactions++;

        if (txn.status === 'success' || txn.status === 'completed') {
          successfulTransactions++;
        }
        if (txn.status === 'failed') failedTransactions++;
        if (txn.status === 'pending') pendingTransactions++;

        if (txn.amount) {
          totalVolume += txn.amount;
        }

        if (txn.type) {
          transactionsByType[txn.type] =
            (transactionsByType[txn.type] || 0) + 1;
        }
      });

      const averageAmount =
        totalTransactions > 0 ? totalVolume / totalTransactions : 0;

      return {
        success: true,
        data: {
          totalTransactions,
          successfulTransactions,
          failedTransactions,
          pendingTransactions,
          totalTransactionVolume: totalVolume,
          averageTransactionAmount: Math.round(averageAmount * 100) / 100,
          transactionsByType,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to generate transactions report: ${error.message}`,
      );
    }
  }

  async getRevenueReport(): Promise<{ success: boolean; data: RevenueReport }> {
    try {
      const db = this.firebaseService.db;
      const txnSnapshot = await db.collection('transactions').get();

      let totalRevenue = 0;
      let monthlyRevenue = 0;
      let yearlyRevenue = 0;
      let platformFees = 0;
      const revenueByMonth: { [key: string]: number } = {};

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      txnSnapshot.forEach((doc) => {
        const txn = doc.data();

        if (txn.status === 'success' || txn.status === 'completed') {
          const fee = txn.platformFee || txn.fee || 0;
          totalRevenue += fee;
          platformFees += fee;

          if (txn.createdAt) {
            const txnDate = txn.createdAt.toDate();
            const txnMonth = txnDate.getMonth();
            const txnYear = txnDate.getFullYear();

            if (txnMonth === currentMonth && txnYear === currentYear) {
              monthlyRevenue += fee;
            }

            if (txnYear === currentYear) {
              yearlyRevenue += fee;
            }

            const monthKey = `${txnYear}-${String(txnMonth + 1).padStart(2, '0')}`;
            revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + fee;
          }
        }
      });

      const revenueByMonthArray = Object.entries(revenueByMonth)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12); // Last 12 months

      return {
        success: true,
        data: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
          revenueThisYear: Math.round(yearlyRevenue * 100) / 100,
          platformFees: Math.round(platformFees * 100) / 100,
          interestRevenue: 0, // Would need separate tracking
          revenueGrowth: 0, // Would need historical data
          revenueByMonth: revenueByMonthArray,
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate revenue report: ${error.message}`);
    }
  }

  async getDashboardAnalytics(): Promise<{
    success: boolean;
    data: DashboardAnalytics;
  }> {
    try {
      const db = this.firebaseService.db;

      // Get counts for overview
      const usersCount = (await db.collection('users').get()).size;
      const loansCount = (await db.collection('ads').get()).size;
      const disputesSnapshot = await db.collection('disputes').get();

      let activeDisputes = 0;
      let disputesResolvedToday = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      disputesSnapshot.forEach((doc) => {
        const dispute = doc.data();
        if (
          dispute.status === 'open' ||
          dispute.status === 'in-progress' ||
          dispute.status === 'escalated'
        ) {
          activeDisputes++;
        }

        if (dispute.resolvedAt) {
          const resolvedDate = dispute.resolvedAt.toDate();
          if (resolvedDate >= today) {
            disputesResolvedToday++;
          }
        }
      });

      // Get today's activity
      const usersSnapshot = await db.collection('users').get();
      const adsSnapshot = await db.collection('ads').get();
      const txnSnapshot = await db.collection('transactions').get();

      let newUsersToday = 0;
      let loansCreatedToday = 0;
      let transactionsToday = 0;

      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.createdAt) {
          const createdDate = user.createdAt.toDate();
          if (createdDate >= today) newUsersToday++;
        }
      });

      adsSnapshot.forEach((doc) => {
        const ad = doc.data();
        if (ad.createdAt) {
          const createdDate = ad.createdAt.toDate();
          if (createdDate >= today) loansCreatedToday++;
        }
      });

      txnSnapshot.forEach((doc) => {
        const txn = doc.data();
        if (txn.createdAt) {
          const createdDate = txn.createdAt.toDate();
          if (createdDate >= today) transactionsToday++;
        }
      });

      // Calculate total revenue
      let totalRevenue = 0;
      txnSnapshot.forEach((doc) => {
        const txn = doc.data();
        if (txn.status === 'success' || txn.status === 'completed') {
          totalRevenue += txn.platformFee || txn.fee || 0;
        }
      });

      // Generate alerts
      const alerts: Array<{
        type: 'warning' | 'error' | 'info';
        message: string;
        count: number;
      }> = [];
      if (activeDisputes > 5) {
        alerts.push({
          type: 'warning' as const,
          message: 'High number of active disputes',
          count: activeDisputes,
        });
      }
      if (newUsersToday > 10) {
        alerts.push({
          type: 'info' as const,
          message: 'Unusual spike in new user registrations',
          count: newUsersToday,
        });
      }

      return {
        success: true,
        data: {
          overview: {
            totalUsers: usersCount,
            totalLoans: loansCount,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            activeDisputes,
          },
          recentActivity: {
            newUsersToday,
            loansCreatedToday,
            transactionsToday,
            disputesResolvedToday,
          },
          trends: {
            userGrowthRate: 0, // Would need historical data
            loanGrowthRate: 0,
            revenueGrowthRate: 0,
            disputeResolutionRate: 0,
          },
          alerts,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to generate dashboard analytics: ${error.message}`,
      );
    }
  }
}
