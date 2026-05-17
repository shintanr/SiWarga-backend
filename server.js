import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import './db.js';
import familyRoutes from './routes/familyRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import dasboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/families', familyRoutes);
app.use('/api/families/:familyId/members', memberRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/dashboard', dasboardRoutes);


const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
