import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import './db.js';
import familyRoutes from './routes/familyRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { protect } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API Running');
});


app.use('/api/auth', authRoutes);
app.use('/api/families', protect, familyRoutes);
app.use('/api/families/:familyId/members', protect, memberRoutes);
app.use('/api/members', protect, memberRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);



const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
