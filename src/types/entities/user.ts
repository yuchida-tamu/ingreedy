import { z } from 'zod';

// User entity schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript type for User entity
export type TUser = z.infer<typeof userSchema>;
