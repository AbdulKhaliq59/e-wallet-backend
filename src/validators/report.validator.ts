import { z } from 'zod';

export const generateReportSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    categories: z.array(z.string()).optional(),
    accounts: z.array(z.string()).optional()
});