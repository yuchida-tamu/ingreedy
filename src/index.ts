import { createApp } from '@/app';
import { Request, Response } from 'express';

const app = createApp();

// Basic route for testing
app.get('/', (_req: Request, res: Response): void => {
  res.json({ message: 'Welcome to Ingreedy API' });
});

app.listen(process.env.PORT, () => {
  console.info(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
  console.info(`API available at ${process.env.API_PREFIX}/${process.env.API_VERSION}`);
});
