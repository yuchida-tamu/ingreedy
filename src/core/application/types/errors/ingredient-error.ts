import { ApplicationError } from '@/core/application/types/errors/application-error';

const INGREDIENT_ERROR_CODES = {
  BASE: 'INGREDIENT_ERROR',
  NOT_FOUND: 'INGREDIENT_NOT_FOUND',
  ALREADY_EXISTS: 'INGREDIENT_ALREADY_EXISTS',
} as const;

export class IngredientError extends ApplicationError {
  constructor(
    message: string,
    code: string = INGREDIENT_ERROR_CODES.BASE,
    details: Record<string, string> = {},
  ) {
    super(message, code, details);
    this.name = 'IngredientError';
  }
}

export class IngredientNotFoundError extends IngredientError {
  constructor(details: Record<string, string>) {
    super('Ingredient not found', INGREDIENT_ERROR_CODES.NOT_FOUND, details);
    this.name = 'IngredientNotFoundError';
  }
}

export class IngredientAlreadyExistsError extends IngredientError {
  constructor(details: Record<string, string>) {
    super('Ingredient already exists', INGREDIENT_ERROR_CODES.ALREADY_EXISTS, details);
    this.name = 'IngredientAlreadyExistsError';
  }
}
