import { Request, Response } from 'express';
import logger from '@/utils/logger';
import { authService } from '@/services/auth.service';

class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const authResponse = await authService.register(req.body);
            res.status(201).json(authResponse);
        } catch (error) {
            logger.error('Registration error:', error);
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Registration failed'
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const authResponse = await authService.login(req.body);
            res.status(200).json(authResponse);
        } catch (error) {
            logger.error('Login error:', error);
            res.status(401).json({
                message: error instanceof Error ? error.message : 'Authentication failed'
            });
        }
    }
}

export const authController = new AuthController();