interface IApplicationError extends Error {
  code: string;
  details: Record<string, string>;
}

export class ApplicationError extends Error implements IApplicationError {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details: Record<string, string>,
  ) {
    super(message);
  }
}
