import 'dotenv/config';
import type { Request, Response } from 'express';
import { createApp } from './app';

const app = createApp();

// Basic route for testing
app.get('/', (_req: Request, res: Response): void => {
  res.json({ message: 'Welcome to Ingreedy API' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
  console.info(`API available at ${process.env.API_PREFIX}/${process.env.API_VERSION}`);
});
