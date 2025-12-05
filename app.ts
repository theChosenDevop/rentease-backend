import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ message: 'RentEase API - Property Rental Backend' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})
export default app;