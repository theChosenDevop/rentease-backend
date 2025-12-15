import express from 'express';
import './config/passport';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();
console.log("DB Connection String:", process.env.DATABASE_URL);
const app = express();
app.use(express.json());
// app.use(passport.initialize());
// app.use('/api/auth', authRoutes)
// app.use('/api/properties', propertyRoutes)
// app.get('/', (req, res) => {
//     res.json({ message: 'RentEase API - Property Rental Backend' });
// })
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    log(`✅ Server runnning on http://localhost:${PORT}`);
});
export default app;
//# sourceMappingURL=server.js.map