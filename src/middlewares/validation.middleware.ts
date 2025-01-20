import { NextFunction, Request, Response } from "express";
import { z } from "zod";

type RequestLocation = 'body' | 'query' | 'params'

export const validateRequest = (schema: z.ZodSchema, location: RequestLocation = 'body') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = location === 'body' ? req.body :
                location === 'query' ? req.query :
                    req.params;

            const validatedData = await schema.parseAsync(data);
            if (location === 'body') {
                req.body = validatedData;
            } else if (location === 'query') {
                req.query = validatedData;
            } else {
                req.params = validatedData;
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: errors
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Validation error'
            });
        }
    };
};
