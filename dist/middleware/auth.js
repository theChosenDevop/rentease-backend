import jwt from "jsonwebtoken";
import { prisma } from '../lib/prisma.ts';
import '../lib/prisma.ts';
import dotenv from 'dotenv';
dotenv.config();
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
export const isOwner = async (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ error: 'Authentication required' });
    const propertyId = req.params.id || req.body.propertyId;
    if (!propertyId) {
        return res.status(400).json({ error: 'Property ID required' });
    }
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { landlordId: true }
    });
    if (!property || property.landlordId !== req.user.id) {
        return res.status(403).json({ error: 'You can only manage your own properties' });
    }
    next();
};
//# sourceMappingURL=auth.js.map