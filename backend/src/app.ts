import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import campRoutes from './routes/camp.routes';
import studentRoutes from './routes/student.routes';
import notificationRoutes from './routes/notification.routes';
import plagiarismRoutes from './routes/plagiarism.routes';
import offlineSessionRoutes from './routes/offline-session.routes';
import friendRoutes from './routes/friend.routes';
import reportRoutes from './routes/report.routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import { logger } from './utils/logger';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

// Request logging (simulating morgan with winston if needed, but morgan is fine for basic HTTP logs)
// We didn't install morgan, so let's write a simple custom logger middleware using winston
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/plagiarism', plagiarismRoutes);
app.use('/api/offline-sessions', offlineSessionRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Darpan API is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
