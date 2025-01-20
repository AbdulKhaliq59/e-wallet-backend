import { Request } from "express";
import { ICreateTransactionRequest } from "./transaction.types";


interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}

export interface CreateTransactionRequest extends AuthRequest {
    body: ICreateTransactionRequest;
}

export interface GetTransactionsRequest extends AuthRequest {
    query: {
        startDate?: string;
        endDate?: string;
        category?: string;
        account?: string;
        type?: 'income' | 'expense';
    }
}

export interface GenerateReportRequest extends AuthRequest {
    query: {
        startDate: string;
        endDate: string;
        categories?: string[];
        accounts?: string[];
    }
}