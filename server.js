import express from 'express';
import dotenv from 'dotenv';

import './db.js';
import familyRoutes from './routes/familyRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Running');
});

app.use('/api/families', familyRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});