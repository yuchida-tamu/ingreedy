import { UserService } from '@/services/user/user-service';
import { TApiResponse } from '@/types/api/response';
import { newUserDtoSchema } from '@/types/dtos/user.dto';
import { InternalServerError, UserValidationError } from '@/types/errors/user-error';
import { Request, Response } from 'express';
import { z } from 'zod';

// Map domain error codes to HTTP status codes
const errorStatusMap: Record<string, number> = {
  USER_ALREADY_EXISTS: 409,
  USER_CREATION_FAILED: 500,
  VALIDATION_ERROR: 400,
};

// Schema for validating user ID
const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = userIdSchema.safeParse(req.query);
      if (!validationResult.success) {
        const response = {
          success: false,
          error: new UserValidationError({
            message: validationResult.error.message,
          }),
        } as const satisfies TApiResponse<never>;
        res.status(400).json(response);
        return;
      }

      const result = await this.userService.getUserById(validationResult.data.id);
      if (!result.success) {
        const response = {
          success: false,
          error: result.error,
        } as const satisfies TApiResponse<never>;
        res.status(result.error.code === 'USER_NOT_FOUND' ? 404 : 500).json(response);
        return;
      }

      const response = {
        success: true,
        data: result.data,
      } as const satisfies TApiResponse<typeof result.data>;
      res.status(200).json(response);
    } catch (error) {
      const response = {
        success: false,
        error: new InternalServerError({
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      } as const satisfies TApiResponse<never>;
      res.status(500).json(response);
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = newUserDtoSchema.safeParse(req.body);
      if (!validationResult.success) {
        const response = {
          success: false,
          error: new UserValidationError({
            message: validationResult.error.message,
          }),
        } as const satisfies TApiResponse<never>;
        res.status(400).json(response);
        return;
      }

      const result = await this.userService.createUser(validationResult.data);
      if (!result.success) {
        const status = errorStatusMap[result.error.code] || 500;
        const response = {
          success: false,
          error: result.error,
        } as const satisfies TApiResponse<never>;
        res.status(status).json(response);
        return;
      }

      const response: TApiResponse<typeof result.data> = {
        success: true,
        data: result.data,
      };
      res.status(201).json(response);
    } catch (error) {
      const response = {
        success: false,
        error: new InternalServerError({
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      } as const satisfies TApiResponse<never>;

      res.status(500).json(response);
    }
  }
}
