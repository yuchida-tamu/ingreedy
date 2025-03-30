// API error response type
export type TApiError = {
  message: string;
  code: string;
};

// Generic API response type
export type TApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: TApiError;
};
