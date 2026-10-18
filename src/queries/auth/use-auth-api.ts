'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/auth-api';
import type {
  EmailValues,
  RegisterValues,
  ResetValues,
  SignInValues,
  VerifyValues,
} from '@/lib/auth-schemas';

export const useAuthApi = () => ({
  signIn: (body: SignInValues) => apiRequest('/auth/sessions', { method: 'POST', body }),
  register: (body: RegisterValues) => apiRequest('/auth/registrations', { method: 'POST', body }),
  verifyEmail: (body: VerifyValues) =>
    apiRequest('/auth/registrations/verify-email', { method: 'POST', body }),
  resendEmailOtp: (body: EmailValues) =>
    apiRequest('/auth/registrations/resend-email-otp', { method: 'POST', body }),
  requestPasswordRecovery: (body: EmailValues) =>
    apiRequest('/auth/password-recovery-requests', { method: 'POST', body }),
  resetPassword: (body: ResetValues) => apiRequest('/auth/password-resets', { method: 'POST', body }),
  confirmEmailChange: (token: string) =>
    apiRequest('/account/email-changes/verify', { method: 'POST', body: { token } }),
});

export const useAuthSessionQuery = () =>
  useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => apiRequest('/auth/session'),
  });
