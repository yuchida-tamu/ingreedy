import { UserService } from '@/services/user/user-service';
import { TApiResponse } from '@/types/api/response';
import { InternalServerError } from '@/types/errors/user-error';
import { Request, Response } from 'express';

// Map domain error codes to HTTP status codes
const errorStatusMap: Record<string, number> = {
  USER_ALREADY_EXISTS: 409,
  USER_CREATION_FAILED: 500,
  VALIDATION_ERROR: 400,
  USER_NOT_FOUND: 404,
};

export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.getUserById(req.query.id as string);
      if (!result.success) {
        const status = errorStatusMap[result.error.code] || 500;
        const response = {
          success: false,
          error: result.error,
        } as const satisfies TApiResponse<never>;
        res.status(status).json(response);
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
      const result = await this.userService.createUser(req.body);
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
