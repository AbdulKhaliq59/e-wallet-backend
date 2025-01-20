import { Transaction } from "@/models";
import { ICreateTransactionRequest, ITransactionFilters, ITransactionResponse } from "@/types/transaction.types";
import { Types } from "mongoose";

class TransactionService {
    private transformTransactionResponse(transaction: any): ITransactionResponse {
        return {
            id: transaction._id.toString(),
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            account: transaction.account,
            description: transaction.description,
            date: transaction.date
        };
    }

    async createTransaction(
        userId: string,
        transactionData: ICreateTransactionRequest
    ): Promise<ITransactionResponse> {

        const transaction = await Transaction.create({
            userId: new Types.ObjectId(userId),
            ...transactionData,
        })
        const populatedTransaction = await Transaction.findById(transaction._id)
            .populate('category');

        return this.transformTransactionResponse(populatedTransaction)
    }

    async getTransactions(
        userId: string,
        filters: ITransactionFilters
    ): Promise<ITransactionResponse[]> {
        const query: any = { userId: new Types.ObjectId(userId) };
        if (filters.startDate && filters.endDate) {
            query.date = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }
        if (filters.category) {
            query.category = new Types.ObjectId(filters.category);
        }

        if (filters.account) {
            query.account = filters.account;
        }
        if (filters.type) {
            query.type = filters.type;
        }

        const transactions = await Transaction.find(query)
            .populate('category')
            .sort({ date: -1 });
        return transactions.map(transaction =>
            this.transformTransactionResponse(transaction)
        )

    }

    async getAccountBalance(
        userId: string,
        account: string
    ): Promise<number> {
        const transactions = await Transaction.find({
            userId: new Types.ObjectId(userId),
            account
        });
        return transactions.reduce((balance, transaction) => {
            if (transaction.type === 'income') {
                return balance + transaction.amount;
            }
            return balance - transaction.amount;
        }, 0);
    }

    async getAllAccountsBalance(userId: string): Promise<Record<string, number>> {
        const transactions = await Transaction.find({
            userId: new Types.ObjectId(userId)
        });

        const balances: Record<string, number> = {
            bank: 0,
            mobile_money: 0,
            cash: 0
        }
        transactions.forEach(transaction => {
            const amount = transaction.type === 'income' ?
                transaction.amount : -transaction.amount;
            balances[transaction.account] += amount
        })

        return balances;
    }
}

export const transactionService = new TransactionService()