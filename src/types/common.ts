// Result type for handling success/error responses
export type TResult<T, E = Error> = { success: true; data: T } | { success: false; error: E };
