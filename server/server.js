import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import { setMemoryStoreMode } from './utils/fallbackStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let server;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Mental health app API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/resources', resourceRoutes);

const startServer = () => {
  if (server) return;
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mentalhealthapp')
  .then(() => {
    setMemoryStoreMode(false);
    console.log('MongoDB connected');
    startServer();
  })
  .catch((error) => {
    setMemoryStoreMode(true);
    console.warn('MongoDB connection failed, continuing with local fallback mode:', error.message);
    startServer();
  });
