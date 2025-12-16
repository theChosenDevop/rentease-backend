import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['TENANT', 'LANDLORD', 'ADMIN']).optional().default('TENANT'),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

export const createPropertySchema = z.object({
    title: z.string().min(5),
    description: z.string().optional(),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    price: z.number().positive(),
    bedrooms: z.number().int().min(1),
    images: z.array(z.string().url()).optional(),
    status: z.enum(['AVAILABLE', 'RENTED']).optional().default('AVAILABLE'),
})

export const updatePropertySchema = createPropertySchema.partial()


export const validate = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                })
            }
            next(error);
        }
    }
}