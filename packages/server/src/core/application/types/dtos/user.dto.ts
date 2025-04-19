import { userSchema } from '@/core/domain/user/user.entity';
import { z } from 'zod';

// DTO schema for new user registration request
export const newUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
});

// DTO schema for user response (excluding sensitive data)
export const userResponseDtoSchema = userSchema.omit({ password: true });

// DTO schema for update user request
export const updateUserDtoSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    username: z.string().min(3).optional(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided for update',
      });
    }
  });

// TypeScript types for DTOs
export type TNewUserDto = z.infer<typeof newUserDtoSchema>;
export type TUserResponseDto = z.infer<typeof userResponseDtoSchema>;
export type TUpdateUserDto = z.infer<typeof updateUserDtoSchema>;
