import express from 'express';
import authRoutes from './routes/auth.routes';
import passport from 'passport';
import './config/passport';
import dotenv from 'dotenv';
import { log } from 'console';
import propertyRoutes from './routes/property.routes';


process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('🔥 Unhandled Rejection:', reason);
  process.exit(1);
});

dotenv.config();


if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

console.log("DB Connection String:", process.env.DATABASE_URL);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use((req, _res, next) => {
  console.log('🌍', req.method, req.originalUrl, '| Content-Type:', req.get('Content-Type'));
  next();
});

app.use(passport.initialize());

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'RentEase API - Property Rental Backend' });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    log(`✅ Server runnning on http://localhost:${PORT}`)
})

export default app;