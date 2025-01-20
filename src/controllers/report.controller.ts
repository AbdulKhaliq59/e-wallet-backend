import { Response } from 'express';
import { reportService } from '@/services/report.service';
import { GenerateReportRequest } from '@/types/request.types';
import { IApiResponse, IErrorResponse } from '@/types/response.types';
import { AccountType } from '@/types/transaction.types';

export class ReportController {
    async generateReport(
        req: GenerateReportRequest,
        res: Response
    ): Promise<void> {
        try {
            if (!req.user?.id) {
                throw new Error('User not authenticated');
            }

            const filters = {
                startDate: new Date(req.query.startDate),
                endDate: new Date(req.query.endDate),
                categories: req.query.categories,
                accounts: req.query.accounts?.map(account => account as AccountType)
            };

            const report = await reportService.generateReport(
                req.user.id,
                filters
            );

            const response: IApiResponse<typeof report> = {
                success: true,
                data: report
            };

            res.json(response);
        } catch (error) {
            const errorResponse: IErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(errorResponse);
        }
    }
}
