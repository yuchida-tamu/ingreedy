import { z } from 'zod';

// User entity schema for validation
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Domain entity type
export type User = z.infer<typeof userSchema>;

// Value Objects and domain-specific types
export type UserId = string & { readonly _brand: unique symbol };
export type UserEmail = string & { readonly _brand: unique symbol };
