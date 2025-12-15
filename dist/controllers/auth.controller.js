import { hashPassword, comparePassword } from '../utils/hashPassword.ts';
import { generateToken } from '../utils/generateToken.ts';
import { prisma } from '../lib/prisma.ts';
import passport from 'passport';
import { log } from 'console';
export const register = async (req, res) => {
    const { email, password, firstName, lastName, role = 'TENANT' } = req.body;
    log(req.body);
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(user.id, user.email, user.role);
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });
export const googleCallback = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(400).json({ error: 'Google llogin failed' });
    }
    const token = generateToken(user.id, user.email, user.role);
    res.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        token
    });
};
//# sourceMappingURL=auth.controller.js.map