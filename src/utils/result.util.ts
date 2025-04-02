import type { TResult } from '@/core/application/types/result';

export class ResultUtil {
  static success<T>(data: T): TResult<T> {
    return { success: true, data };
  }

  static fail<E>(error: E): TResult<never, E> {
    return { success: false, error };
  }
}
