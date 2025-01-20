import { User } from "@/models";
import { authService } from "@/services/auth.service";
import { AuthRequest } from "@/types/request.types";
import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No Token Provided'
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Invalid token format'
            });
            return;
        }
        try {
            const decodedToken = await authService.validateToken(token);
            const user = await User.findById(decodedToken.id).select('-password');
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'User not found'
                })
                return;
            }
            req.user = {
                id: user.id.toString(),
                name: user.name,
                email: user.email
            }
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                error: "Invalid token"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: " Authentication error"
        })
    }

}