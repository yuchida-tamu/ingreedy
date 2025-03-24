import { UserValidationError } from '@/types/errors/user-error';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validateRequest = (schema: AnyZodObject, target: ValidationTarget = 'body') => {
  return (req: Request, _: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req[target]);

    if (!validationResult.success) {
      next(new UserValidationError({ message: validationResult.error.message }));
      return;
    }

    // Add validated data to request
    req[target] = validationResult.data;
    next();
  };
};
