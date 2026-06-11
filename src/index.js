import dotenv from 'dotenv';
dotenv.config();  // ← MUST be first!

import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import './models/index.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

db.authenticate()
  .then(() => {
    console.log('Database connected ✅');
    return db.sync({ alter: true });
  })
  .then(() => {
    console.log('Tables synced ✅');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.log('Connection Error ❌', err.message);  // ← this will show exact error
  });