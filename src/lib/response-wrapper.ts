import type { ApiErrorBody } from '@/types/api';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const optionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly requestId?: string,
    readonly retryAfter?: number,
  ) {
    super(code);
    this.name = 'ApiRequestError';
  }
}

export const createApiError = async (response: Response): Promise<ApiRequestError> => {
  const payload: unknown = await response.json().catch(() => undefined);
  const errorBody = isRecord(payload) && isRecord(payload.error) ? payload.error : undefined;
  const body: ApiErrorBody = errorBody
    ? {
        error: {
          code: optionalString(errorBody.code),
          message: optionalString(errorBody.message),
          requestId: optionalString(errorBody.requestId),
        },
      }
    : {};
  const retryAfterHeader = response.headers.get('Retry-After');
  const retryAfter = retryAfterHeader === null ? undefined : Number(retryAfterHeader);

  return new ApiRequestError(
    response.status,
    body.error?.code ?? 'request_failed',
    body.error?.requestId,
    retryAfter,
  );
};

export const responseWrapper = async <T>(response: Response): Promise<T> => {
  if (!response.ok) throw await createApiError(response);
  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
};
