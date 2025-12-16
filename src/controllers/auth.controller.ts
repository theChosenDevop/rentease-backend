import type { Request, Response } from 'express'
import { hashPassword, comparePassword } from '../utils/hashPassword'
import { generateToken } from '../utils/generateToken'
import { prisma } from '../lib/prisma'
import passport from 'passport'
import { log } from 'console'

export const register = 
    async (req: Request, res: Response) => {
        const { email, password, firstName, lastName, role = 'TENANT' } = req.body;
        log(req.body);

        if (!email && !password && !firstName && !lastName && !role) return res.status(400).json({ message: "Please provide credentials" });

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
            return res.status(201).json({ user });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' })
        }
    }

export const login = 
    async (req: Request, res: Response) => {

        const { email, password } = req.body;

        if (!email && !password) return res.status(400).json({ message: 'Please provide credentials' })

        try {
            const user = await prisma.user.findUnique({ where: { email } })
            if (!user || !user.password) {
                return res.status(400).json({ error: 'Invalid credentials' })
            }
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' })
            }
            const token = generateToken(user.id, user.email, user.role)
            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                token
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' })
        }
    };

export const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] })

export const googleCallback = async (req: Request, res: Response) => {
    const user = req.user as any;
    if (!user) {
        return res.status(400).json({ error: 'Google login failed' });
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
    })
}