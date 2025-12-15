import { Router } from 'express';
import passport from 'passport';
import { register, login, googleLogin, googleCallback } from '../controllers/auth.controller.ts';
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/google', googleLogin);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallback);
export default router;
//# sourceMappingURL=auth.routes.js.map