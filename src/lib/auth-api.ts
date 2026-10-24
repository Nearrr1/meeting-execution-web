import { ApiRequestError, createApiError, responseWrapper } from './response-wrapper';
import type { ApiRequestOptions } from '@/types';

export { ApiRequestError } from './response-wrapper';

export type Provider = 'google' | 'microsoft';

export interface Identity {
  id: string;
  provider: 'google' | 'microsoft' | 'local';
  label: string;
  verified?: boolean;
  linkedAt?: string;
}

export interface AccountSession {
  account: {
    id: string;
    displayName: string;
    primaryEmail: { address: string; verified: boolean };
    identities: Identity[];
  };
  session: { idleExpiresAt: string; absoluteExpiresAt: string };
}

export interface SessionSummary {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  idleExpiresAt: string;
  absoluteExpiresAt: string;
  userAgentLabel?: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '/api/v1';
let csrfToken: string | undefined;
let csrfRequest: Promise<string> | undefined;

function getApiBase(): string {
  return apiBase;
}

async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (csrfToken && !forceRefresh) return csrfToken;
  if (csrfRequest && !forceRefresh) return csrfRequest;
  csrfRequest = (async () => {
    const response = await fetch(`${getApiBase()}/auth/csrf-token`, {
      credentials: 'include',
      cache: 'no-store',
    });
    const result = await responseWrapper<{ csrfToken: string }>(response);
    csrfToken = result.csrfToken;
    return csrfToken;
  })();
  try {
    return await csrfRequest;
  } finally {
    csrfRequest = undefined;
  }
}

export async function apiRequest<T = void>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const mutating = !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
  const run = async (token?: string) => {
    const headers = new Headers({ Accept: 'application/json' });
    if (options.body !== undefined) headers.set('Content-Type', 'application/json');
    if (token) headers.set('X-CSRF-Token', token);
    return fetch(`${getApiBase()}${path}`, {
      method,
      headers,
      credentials: 'include',
      cache: 'no-store',
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  };

  let response = await run(mutating ? await getCsrfToken() : undefined);
  if (mutating && response.status === 403) {
    const error = await createApiError(response);
    if (error.code === 'csrf_validation_failed') {
      csrfToken = undefined;
      response = await run(await getCsrfToken(true));
    } else {
      throw error;
    }
  }
  return responseWrapper<T>(response);
}

export function oidcStartUrl(provider: Provider, options: { intent?: 'link'; returnTo?: string } = {}) {
  const url = new URL(`${getApiBase()}/auth/oidc/${provider}/start`, window.location.origin);
  if (options.intent) url.searchParams.set('intent', options.intent);
  if (options.returnTo) url.searchParams.set('returnTo', options.returnTo);
  return url.toString();
}

export function readableError(error: unknown): string {
  if (!(error instanceof ApiRequestError))
    return 'We could not reach the service. Check your connection and try again.';
  if (error.status === 401) return 'Those details could not be verified. Check them and try again.';
  if (error.status === 403)
    return 'This request could not be completed. Refresh the page and try again.';
  if (error.status === 409) return 'This change conflicts with your current account setup.';
  if (error.status === 429) {
    const retryAfter = error.retryAfter;
    const seconds =
      typeof retryAfter === 'number' && Number.isFinite(retryAfter) ? Math.max(1, retryAfter) : 60;
    return `Too many attempts. Please wait ${seconds} seconds and try again.`;
  }
  if (error.status === 400) return 'Some details are missing or invalid. Review the form and try again.';
  return 'We could not complete that request. Try again shortly.';
}
