import { Transaction } from '@/models/transaction.model';
import {
    IReportFilters,
    IReportResponse,
    ICategorySummary,
    IAccountSummary,
} from '@/types/report.types';
import { AccountType, ITransactionResponse } from '@/types/transaction.types';
import { Types } from 'mongoose';

class ReportService {
    async generateReport(
        userId: string,
        filters: IReportFilters
    ): Promise<IReportResponse> {
        const query = {
            userId: new Types.ObjectId(userId),
            date: {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            },
            ...(filters.categories?.length && {
                category: {
                    $in: filters.categories.map(cat => new Types.ObjectId(cat))
                }
            }),
            ...(filters.accounts?.length && {
                account: { $in: filters.accounts }
            })
        };

        const transactions = await Transaction.find(query)
            .populate('category')
            .sort({ date: -1 });

        const { totalIncome, totalExpenses } = this.calculateTotals(transactions);
        const categoryBreakdown = this.generateCategoryBreakdown(transactions, totalExpenses);
        const accountBreakdown = this.generateAccountBreakdown(transactions);

        return {
            summary: {
                totalIncome,
                totalExpenses,
                netAmount: totalIncome - totalExpenses,
                categoryBreakdown,
                accountBreakdown
            },
            transactions: this.mapTransactionsToResponse(transactions),
            period: {
                start: filters.startDate,
                end: filters.endDate
            }
        };
    }

    private calculateTotals(transactions: any[]): { totalIncome: number; totalExpenses: number } {
        return transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === 'income') {
                    acc.totalIncome += transaction.amount;
                } else {
                    acc.totalExpenses += transaction.amount;
                }
                return acc;
            },
            { totalIncome: 0, totalExpenses: 0 }
        );
    }

    private generateCategoryBreakdown(
        transactions: any[],
        totalExpenses: number
    ): ICategorySummary[] {
        const categoryMap = new Map<string, ICategorySummary>();

        transactions.forEach(transaction => {
            const categoryId = transaction.category._id.toString();
            const amount = transaction.type === 'expense' ? transaction.amount : 0;

            if (!categoryMap.has(categoryId)) {
                categoryMap.set(categoryId, {
                    categoryId,
                    categoryName: transaction.category.name,
                    amount: 0,
                    percentage: 0,
                    transactionCount: 0
                });
            }

            const summary = categoryMap.get(categoryId)!;
            summary.amount += amount;
            summary.transactionCount++;
        });

        return Array.from(categoryMap.values()).map(category => ({
            ...category,
            percentage: totalExpenses ? (category.amount / totalExpenses) * 100 : 0
        }));
    }

    private generateAccountBreakdown(transactions: any[]): IAccountSummary[] {
        const accountMap = new Map<AccountType, IAccountSummary>();
        const totalTransactions = transactions.length;

        transactions.forEach(transaction => {
            const account = transaction.account as AccountType;

            if (!accountMap.has(account)) {
                accountMap.set(account, {
                    account,
                    amount: 0,
                    percentage: 0,
                    transactionCount: 0
                });
            }

            const summary = accountMap.get(account)!;
            summary.amount += transaction.type === 'income'
                ? transaction.amount
                : -transaction.amount;
            summary.transactionCount++;
        });

        return Array.from(accountMap.values()).map(account => ({
            ...account,
            percentage: totalTransactions
                ? (account.transactionCount / totalTransactions) * 100
                : 0
        }));
    }

    private mapTransactionsToResponse(transactions: any[]): ITransactionResponse[] {
        return transactions.map(t => ({
            id: t._id.toString(),
            amount: t.amount,
            type: t.type,
            category: {
                id: t.category._id.toString(),
                name: t.category.name
            },
            account: t.account,
            description: t.description,
            date: t.date
        }));
    }
}

export const reportService = new ReportService();