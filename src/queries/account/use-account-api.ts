'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest, type AccountSession, type Provider, type SessionSummary } from '@/lib/auth-api';

type SessionsResponse = { sessions: SessionSummary[] };
type IdentitiesResponse = { identities: AccountSession['account']['identities'] };
type DeletionResponse = { status: string; purgeAt: string };
type ReauthenticationResponse = { authorizationUrl: string };

export const useAccountApi = (enabled = true) => {
  const accountQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => apiRequest<AccountSession>('/auth/session'),
    enabled,
  });
  const sessionsQuery = useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: () => apiRequest<SessionsResponse>('/auth/sessions'),
    enabled: enabled && accountQuery.isSuccess,
  });
  const identitiesQuery = useQuery({
    queryKey: ['auth', 'identities'],
    queryFn: () => apiRequest<IdentitiesResponse>('/account/identities'),
    enabled: enabled && accountQuery.isSuccess,
  });

  return {
    accountQuery,
    sessionsQuery,
    identitiesQuery,
    signOut: () => apiRequest('/auth/session', { method: 'DELETE' }),
    unlinkIdentity: (identityId: string) =>
      apiRequest(`/account/identities/${encodeURIComponent(identityId)}`, { method: 'DELETE' }),
    requestEmailChange: (body: { newEmail: string }) =>
      apiRequest('/account/email-change-requests', { method: 'POST', body }),
    changePassword: (body: {
      currentPassword: string;
      newPassword: string;
      passwordConfirmation: string;
    }) => apiRequest('/account/password', { method: 'PUT', body }),
    disableAccount: () => apiRequest('/account/disable', { method: 'POST' }),
    requestDeletion: () =>
      apiRequest<DeletionResponse>('/account/deletion-requests', { method: 'POST' }),
    reauthenticateWithPassword: (currentPassword: string) =>
      apiRequest('/auth/reauth', { method: 'POST', body: { currentPassword } }),
    reauthenticateWithProvider: (provider: Provider) =>
      apiRequest<ReauthenticationResponse>('/auth/reauth', {
        method: 'POST',
        body: { provider },
      }),
    revokeSession: (sessionId: string) =>
      apiRequest(`/auth/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' }),
  };
};
