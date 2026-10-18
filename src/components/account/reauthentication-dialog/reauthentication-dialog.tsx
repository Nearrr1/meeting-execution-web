'use client';

import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Identity, Provider } from '@/lib/auth-api';
import type { SecureIntent } from '@/types';
import { BusyLabel } from '../shared-ui';

type ReauthenticationDialogProps = {
  intent: SecureIntent;
  error: string | null;
  busy: boolean;
  hasLocalCredential: boolean;
  identities: Identity[];
  password: string;
  onPasswordChange: ChangeEventHandler<HTMLInputElement>;
  onPasswordKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onReauthenticateWithPassword: () => void;
  onReauthenticateWithProvider: (provider: Provider) => void;
  onCancel: () => void;
};

const isFederatedProvider = (provider: Identity['provider']): provider is Provider =>
  provider === 'google' || provider === 'microsoft';

export const ReauthenticationDialog = ({
  intent,
  error,
  busy,
  hasLocalCredential,
  identities,
  password,
  onPasswordChange,
  onPasswordKeyDown,
  onReauthenticateWithPassword,
  onReauthenticateWithProvider,
  onCancel,
}: ReauthenticationDialogProps) => (
  <div
    className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,42,34,.48)] p-4"
    role="presentation"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onCancel();
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reauth-title"
      className="w-full max-w-[420px] rounded-2xl border border-[var(--line)] bg-[var(--paper-bright)] p-6 shadow-2xl"
    >
      <div className="mb-4 grid size-10 place-items-center rounded-full bg-[#e9ede5] text-[var(--forest)]">
        <ShieldCheck size={18} />
      </div>
      <h2 id="reauth-title" className="font-serif text-3xl tracking-tight">
        {intent.kind === 'delete'
          ? 'Request account deletion?'
          : intent.kind === 'disable'
            ? 'Disable this account?'
            : 'Confirm it’s you.'}
      </h2>
      <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
        {intent.kind === 'delete'
          ? 'This schedules your data for permanent purge within 30 days and ends every active session.'
          : intent.kind === 'disable'
            ? 'This immediately ends every active session and blocks sign-in until support verifies ownership.'
            : 'For your security, verify again before changing account access.'}
      </p>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-[#e7c2b6] bg-[#fff5f0] p-3 text-[11px] text-[var(--danger)]"
        >
          {error}
        </p>
      )}
      {hasLocalCredential ? (
        <>
          <label htmlFor="reauthPassword" className="mb-1.5 mt-5 block text-[11px] font-semibold">
            Current password
          </label>
          <input
            id="reauthPassword"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={onPasswordChange}
            onKeyDown={onPasswordKeyDown}
            className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] h-11 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-[12px]"
          />
          <button
            onClick={onReauthenticateWithPassword}
            disabled={busy}
            className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--forest)] px-3 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            <BusyLabel busy={busy}>Verify and continue</BusyLabel>
          </button>
        </>
      ) : (
        <div className="mt-5 space-y-2">
          {identities
            .filter((identity): identity is Identity & { provider: Provider } =>
              isFederatedProvider(identity.provider),
            )
            .map((identity) => (
              <button
                key={identity.id}
                onClick={() => onReauthenticateWithProvider(identity.provider)}
                disabled={busy}
                className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-white text-[12px] font-semibold capitalize hover:bg-[var(--paper)] disabled:opacity-60"
              >
                <BusyLabel busy={busy}>Continue with {identity.provider}</BusyLabel>
              </button>
            ))}
          <p className="text-[10px] leading-5 text-[var(--muted)]">
            After provider verification, you’ll return to your account. Repeat the selected action to
            finish.
          </p>
        </div>
      )}
      <button
        onClick={onCancel}
        disabled={busy}
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] mt-3 h-10 w-full rounded-lg text-[11px] font-semibold text-[var(--muted)] hover:bg-[var(--paper)]"
      >
        Cancel
      </button>
    </div>
  </div>
);
