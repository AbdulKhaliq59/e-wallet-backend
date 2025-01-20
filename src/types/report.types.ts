import { AccountType, ITransactionResponse } from "./transaction.types";

export interface IReportFilters {
    startDate: Date;
    endDate: Date;
    categories?: string[];
    accounts?: AccountType[];
}

export interface ICategorySummary {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    transactionCount: number;
}


export interface IAccountSummary {
    account: AccountType;
    amount: number;
    percentage: number;
    transactionCount: number;
}

export interface IReportResponse {
    summary: {
        totalIncome: number;
        totalExpenses: number;
        netAmount: number;
        categoryBreakdown: ICategorySummary[];
        accountBreakdown: IAccountSummary[];
    };
    transactions: ITransactionResponse[];
    period: {
        start: Date;
        end: Date;
    };
}