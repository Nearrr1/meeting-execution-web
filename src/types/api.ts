export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
  };
};

export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
};
