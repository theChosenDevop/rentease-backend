import { Router } from 'express';
import passport from 'passport';
import { register, login } from '../controllers/auth.controller';
import { googleLogin, googleCallback } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleLogin);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallback);

export default router;