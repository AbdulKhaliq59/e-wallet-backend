import { Types } from "mongoose";
import {  ICategoryResponse } from "./category.types";

export type AccountType = 'bank' | 'mobile_money' | 'cash';
export type TransactionType = 'income' | 'expense';

export interface ITransaction {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    type: TransactionType;
    category: string;
    account: AccountType;
    description?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateTransactionRequest {
    amount: number;
    type: TransactionType;
    category: string;
    account: AccountType;
    description?: string;
    date?: Date;
}

export interface ITransactionResponse {
    id: string;
    amount: number;
    type: TransactionType;
    category: ICategoryResponse;
    account: AccountType;
    description?: string;
    date?: Date;
}

export interface ITransactionFilters {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    account?: AccountType;
    type?: TransactionType;
}