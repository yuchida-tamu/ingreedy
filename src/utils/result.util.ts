import { TResult } from '@/core/application/types/result';

export class ResultUtil {
  static success<T>(data: T): TResult<T> {
    return { success: true, data };
  }

  static error<E>(error: E): TResult<never, E> {
    return { success: false, error };
  }
}
