import { Types } from "mongoose";
import { ICategory, ICategoryResponse } from "./category.types";

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface IBudget {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    category: string | ICategory;
    amount: number;
    period: BudgetPeriod;
    startDate: Date;
    endDate?: Date;
    currentSpending: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateBudgetRequest {
    category: string;
    amount: number;
    period: BudgetPeriod;
    startDate: Date;
    endDate?: Date;
}

export interface IBudgetResponse {
    id: string;
    category: ICategoryResponse;
    amount: number;
    period: BudgetPeriod;
    startDate: Date;
    endDate?: Date;
    currentSpending: number;
}