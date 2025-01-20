import { Router } from 'express';
import { TransactionController } from '@/controllers/transaction.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validation.middleware';
import { createTransactionSchema, getTransactionsSchema } from '@/validators/transaction.validators';

export const transactionRoutes = Router();
const controller = new TransactionController();

transactionRoutes.use(authMiddleware);

transactionRoutes.post(
    '/',
    validateRequest(createTransactionSchema),
    controller.createTransaction.bind(controller)
);

transactionRoutes.get(
    '/',
    validateRequest(getTransactionsSchema, 'query'),
    controller.getTransactions.bind(controller)
);

transactionRoutes.get(
    '/balances',
    controller.getAccountBalances.bind(controller)
);