import { ApplicationError } from './errors/application-error';

// Result type for handling success/error responses
export type TResult<T, E = ApplicationError> =
  | { success: true; data: T }
  | { success: false; error: E };
