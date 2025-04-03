import { errorHandler } from '@/middleware/error.middleware';
import { generateIngredientRouter } from '@/routes/ingredient-routes';
import { generateUserRouter } from '@/routes/user-routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

export function createApp(): Express {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(morgan(process.env.LOG_FORMAT || 'dev'));

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_MAX || 100),
    }),
  );

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'healthy' });
  });

  // API routes
  const apiRouter = express.Router();
  apiRouter.use('/users', generateUserRouter());
  apiRouter.use('/ingredients', generateIngredientRouter());
  app.use(`${process.env.API_PREFIX || '/api'}/${process.env.API_VERSION || 'v1'}`, apiRouter);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
