import { UserService } from '@/services/user/user-service';
import { TApiResponse } from '@/types/api/response';
import { NextFunction, Request, Response } from 'express';

export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      //req.query.id is supposed to have been validated by the validation middleware
      const result = await this.userService.getUserById(req.query.id as string);
      if (!result.success) {
        next(result.error);
        return;
      }

      const response = {
        success: true,
        data: result.data,
      } as const satisfies TApiResponse<typeof result.data>;
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.userService.createUser(req.body);
      if (!result.success) {
        next(result.error);
        return;
      }

      const response: TApiResponse<typeof result.data> = {
        success: true,
        data: result.data,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
