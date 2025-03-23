import { z } from 'zod';
import { userSchema } from '../entities/user';

// DTO schema for new user registration request
export const newUserDtoSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// DTO schema for user response (excluding sensitive data)
export const userResponseDtoSchema = userSchema.omit({ password: true });

// TypeScript types for DTOs
export type TNewUserDto = z.infer<typeof newUserDtoSchema>;
export type TUserResponseDto = z.infer<typeof userResponseDtoSchema>;
