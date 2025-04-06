export class HttpError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
