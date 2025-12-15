import { Request, Response, NextFunction } from "express";
import {AuthUser} from "../types/auth";
import jwt from "jsonwebtoken";
import type { JwtPayload} from "jsonwebtoken";
import { prisma } from '../lib/prisma';

declare global {
    namespace Express {
        interface User extends AuthUser {}
        interface Request {
            user?: User;
        }
    }
}

interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
    role: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.'})
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as MyJwtPayload;
    if (!decoded || !decoded.id) { 
        res.status(401).json({ message: "Not authorized"});
        return;
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token'})
        return
    }
}


console.log(process.env.JWT_SECRET);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const propertyId = req.params.id || req.body.propertyId;
    if (!propertyId) {
        return res.status(400).json({ error: 'Property ID required' });
    }

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { landlordId: true }
    })

    if (!property || property.landlordId !== req.user.id) {
        return res.status(403).json({ error: 'You can only manage your own properties'})
    }

    next();
}