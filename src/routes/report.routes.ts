import { Router } from 'express';
import { ReportController } from '@/controllers/report.controller';
import { generateReportSchema } from '@/validators/report.validator';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validation.middleware';

export const reportRoutes = Router();
const controller = new ReportController();

reportRoutes.use(authMiddleware);

reportRoutes.get(
    '/',
    validateRequest(generateReportSchema, 'query'),
    controller.generateReport.bind(controller)
);