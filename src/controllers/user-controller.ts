import { UserService } from '@/services/user-service';
import { TApiResponse } from '@/types/api/response';
import { newUserDtoSchema } from '@/types/dtos/user.dto';
import { Request, Response } from 'express';

// Map domain error codes to HTTP status codes
const errorStatusMap: Record<string, number> = {
  USER_ALREADY_EXISTS: 409,
  USER_CREATION_FAILED: 500,
  VALIDATION_ERROR: 400,
};

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = newUserDtoSchema.safeParse(req.body);
      if (!validationResult.success) {
        const response: TApiResponse<never> = {
          success: false,
          error: {
            message: 'Invalid request body',
            code: 'VALIDATION_ERROR',
            details: validationResult.error.errors.reduce((acc, error) => {
              acc[error.path.join('.')] = error.message;
              return acc;
            }, {} as Record<string, string>),
          },
        };
        res.status(errorStatusMap.VALIDATION_ERROR).json(response);
        return;
      }

      const result = await this.userService.createUser(validationResult.data);
      if (!result.success) {
        const status = errorStatusMap[result.error.code] || 500;
        const response: TApiResponse<never> = {
          success: false,
          error: {
            message: result.error.message,
            code: result.error.code,
          },
        };
        res.status(status).json(response);
        return;
      }

      const response: TApiResponse<typeof result.data> = {
        success: true,
        data: result.data,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: TApiResponse<never> = {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      };
      res.status(500).json(response);
    }
  }
}
