// Base domain error type
export type TDomainError = {
  code: string;
  message: string;
  details?: unknown;
};

// User domain specific errors
export type TUserDomainError = TDomainError & {
  code: 'USER_ALREADY_EXISTS' | 'USER_CREATION_FAILED';
};
