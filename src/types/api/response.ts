// API error response type
export type TApiError = {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
};

// Generic API response type
export type TApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: TApiError;
};
