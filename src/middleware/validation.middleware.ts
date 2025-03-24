import { TApiResponse } from '@/types/api/response';
import { UserValidationError } from '@/types/errors/user-error';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validateRequest = (schema: AnyZodObject, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req[target]);

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

    // Add validated data to request
    req[target] = validationResult.data;
    next();
  };
};
