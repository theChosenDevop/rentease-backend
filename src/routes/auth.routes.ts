import { Router } from 'express';
import passport from 'passport';
import { register, login } from '../controllers/auth.controller';
import { googleLogin, googleCallback } from '../controllers/auth.controller';
import { registerSchema, loginSchema, validate } from '../utils/validation'

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [TENANT, LANDLORD, ADMIN]
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/register',validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login',validate(loginSchema), login);

router.get('/google', googleLogin);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallback);


export default router;