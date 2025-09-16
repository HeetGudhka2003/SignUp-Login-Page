import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import authRoutes from './routes/auth';
 
const startServer = async () => {
  try {
    const PORT = Number(process.env.PORT) || 4000;
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set in .env');
    // if (!process.env.CLIENT_URL) console.warn('CLIENT_URL not set, CORS may fail');
    await connectDB(process.env.MONGO_URI);

    const app = express();

    app.use(helmet());
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

    const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
    app.use('/api/auth', limiter);
    app.use('/api/auth', authRoutes);

    app.get('/',(req,res)=>{
      res.send("homepage ")
    })

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Server failed to start:');
    console.error(err instanceof Error ? err.stack : err);
    process.exit(1);
  }
};

startServer();
