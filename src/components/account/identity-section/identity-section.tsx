'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { Identity } from '@/lib/auth-api';
import { ArrowRight, KeyRound, Link2, Unlink } from 'lucide-react';
import { Panel, SectionHeading } from '../shared-ui';
import type { SecureIntent } from '@/types';

type IdentitySectionProps = {
  identities: Identity[];
  showPasswordForm: boolean;
  passwordForm: UseFormReturn<{ newPassword: string; passwordConfirmation: string }>;
  onSecureAction: (intent: SecureIntent) => void;
  onTogglePassword: () => void;
};

export const IdentitySection = ({
  identities,
  showPasswordForm,
  passwordForm,
  onSecureAction,
  onTogglePassword,
}: IdentitySectionProps) => (
  <Panel>
    <SectionHeading
      icon={KeyRound}
      title="Sign-in methods"
      detail="Add a sign-in method explicitly. Email equality never merges accounts."
    />
    <div className="divide-y divide-[var(--line)]">
      {identities.map((identity) => (
        <div
          key={identity.id}
          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--paper)] text-[var(--forest)]">
              <KeyRound size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold capitalize">
                {identity.provider === 'local' ? 'Email and password' : identity.provider}
              </p>
              <p className="truncate text-[10px] text-[var(--muted)]">{identity.label}</p>
            </div>
          </div>
          {identity.provider !== 'local' && (
            <button
              onClick={() => onSecureAction({ kind: 'unlink', identityId: identity.id })}
              aria-label={`Remove ${identity.provider} sign-in`}
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] hover:bg-[var(--paper)]"
            >
              <Unlink size={13} />
              Remove
            </button>
          )}
        </div>
      ))}
      {identities.length === 0 && (
        <p className="py-2 text-[12px] text-[var(--muted)]">No sign-in methods were returned.</p>
      )}
    </div>
    <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
      {(['google', 'microsoft'] as const)
        .filter((provider) => !identities.some((identity) => identity.provider === provider))
        .map((provider) => (
          <button
            key={provider}
            onClick={() => onSecureAction({ kind: 'link', provider })}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--line)] px-3 text-[11px] font-semibold capitalize hover:bg-[var(--paper)]"
          >
            <Link2 size={13} />
            Link {provider}
          </button>
        ))}
      {identities.some((identity) => identity.provider === 'local') && (
        <button
          onClick={onTogglePassword}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--line)] px-3 text-[11px] font-semibold hover:bg-[var(--paper)]"
        >
          <KeyRound size={13} />
          {showPasswordForm ? 'Cancel password change' : 'Change password'}
        </button>
      )}
    </div>
    {showPasswordForm && (
      <form
        onSubmit={passwordForm.handleSubmit(() => onSecureAction({ kind: 'password' }))}
        className="mt-4 grid gap-3 rounded-xl bg-[var(--paper)] p-4 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="newPassword" className="mb-1 block text-[10px] font-semibold">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...passwordForm.register('newPassword')}
            className="h-10 w-full rounded-lg border border-[var(--line)] px-3 text-[12px]"
          />
          {passwordForm.formState.errors.newPassword && (
            <p className="mt-1 text-[10px] text-[var(--danger)]">
              {passwordForm.formState.errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="passwordConfirmation" className="mb-1 block text-[10px] font-semibold">
            Confirm new password
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            {...passwordForm.register('passwordConfirmation')}
            className="h-10 w-full rounded-lg border border-[var(--line)] px-3 text-[12px]"
          />
          {passwordForm.formState.errors.passwordConfirmation && (
            <p className="mt-1 text-[10px] text-[var(--danger)]">
              {passwordForm.formState.errors.passwordConfirmation.message}
            </p>
          )}
        </div>
        <p className="text-[10px] text-[var(--muted)] sm:col-span-2">
          Use at least 8 characters, including uppercase, lowercase, number, and symbol.
        </p>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--forest)] text-[11px] font-semibold text-white sm:col-span-2"
        >
          Continue securely <ArrowRight size={13} />
        </button>
      </form>
    )}
  </Panel>
);
