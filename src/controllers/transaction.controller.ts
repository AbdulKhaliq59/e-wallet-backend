import { transactionService } from "@/services/transaction.service";
import { AuthRequest, CreateTransactionRequest, GetTransactionsRequest } from "@/types/request.types";
import { IApiResponse, IErrorResponse } from "@/types/response.types";
import { AccountType } from "@/types/transaction.types";
import { Response } from "express";


export class TransactionController {
    async createTransaction(
        req: CreateTransactionRequest,
        res: Response
    ): Promise<void> {
        try {
            if (!req.user?.id) {
                throw new Error('User not authenticated')
            }

            const transaction = await transactionService.createTransaction(
                req.user.id,
                req.body
            );

            const response: IApiResponse<typeof transaction> = {
                success: true,
                data: transaction
            };

            res.status(201).json(response);
        } catch (error) {
            const errrorResponse: IErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'An error occured'
            };
            res.status(400).json(errrorResponse);
        }
    }
    async getTransactions(
        req: GetTransactionsRequest,
        res: Response
    ): Promise<void> {
        try {
            if (!req.user?.id) {
                throw new Error('User not Authenticated');
            }
            const filters = {
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                category: req.query.category,
                account: req.query.account as AccountType | undefined,
                type: req.query.type
            }
            const transactions = await transactionService.getTransactions(
                req.user.id,
                filters
            )
            const response: IApiResponse<typeof transactions> = {
                success: true,
                data: transactions
            }
            res.json(response);

        } catch (error) {
            const errorResponse: IErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(errorResponse);

        }
    }
    async getAccountBalances(
        req: AuthRequest,
        res: Response
    ): Promise<void> {
        try {
            if (!req.user?.id) {
                throw new Error('User not authenticated')
            }
            const balances = await transactionService.getAllAccountsBalance(
                req.user.id
            )
            const response: IApiResponse<typeof balances> = {
                success: true,
                data: balances
            }
            res.json(response);
        } catch (error) {
            const errorResponse: IErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred'
            }
            res.status(400).json(errorResponse)
        }
    }
}