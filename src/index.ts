import { createServer } from '@/config/server';
import { logger } from '@/utils/logger';
import { Request, Response } from 'express';

const app = createServer();
const port = process.env.PORT || 3000;

// Basic route for testing
app.get('/', (_req: Request, res: Response): void => {
  res.json({ message: 'Welcome to Ingreedy API' });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
