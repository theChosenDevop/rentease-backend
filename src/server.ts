import express from 'express';
import authRoutes from './routes/auth.routes';
import passport from 'passport';
import './config/passport';
import dotenv from 'dotenv';
import { log } from 'console';
import propertyRoutes from './routes/property.routes';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))


app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'RentEase API - Property Rental Backend' });
})

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    log(`✅ Server runnning on http://localhost:${PORT}`)
})

export default app;