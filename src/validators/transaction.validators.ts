import z from "zod";

export const createTransactionSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(['income', 'expense']),
    category: z.string(),
    account: z.enum(['bank', 'mobile_money', 'cash']),
    description: z.string().optional(),
    date: z.string().optional()
});
export const getTransactionsSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    category: z.string().optional(),
    account: z.enum(['bank', 'mobile_money', 'cash']).optional(),
    type: z.enum(['income', 'expense']).optional()
});
