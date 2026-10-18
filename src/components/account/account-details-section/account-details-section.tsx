'use client';

import type { UseFormReturn } from 'react-hook-form';
import { ArrowRight, Check, UserRound } from 'lucide-react';
import { Panel, SectionHeading } from '../shared-ui';

type AccountDetailsSectionProps = {
  displayName: string;
  primaryEmail: string;
  form: UseFormReturn<{ newEmail: string }>;
  onRequestChange: () => void;
};

export const AccountDetailsSection = ({
  displayName,
  primaryEmail,
  form,
  onRequestChange,
}: AccountDetailsSectionProps) => (
  <Panel>
    <SectionHeading
      icon={UserRound}
      title="Account details"
      detail="Your verified email is the primary contact for this account."
    />
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
          Display name
        </p>
        <p className="mt-1 text-[13px]">{displayName || 'Not set'}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
          Primary email
        </p>
        <p className="mt-1 flex items-center gap-2 text-[13px]">
          {primaryEmail}
          <Check size={13} className="text-[var(--success)]" />
        </p>
      </div>
    </div>
    <form
      onSubmit={form.handleSubmit(onRequestChange)}
      className="mt-5 flex flex-col gap-2 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="newEmail" className="mb-1.5 block text-[11px] font-semibold">
          Change primary email
        </label>
        <input
          id="newEmail"
          type="email"
          autoComplete="email"
          placeholder="new-address@example.com"
          {...form.register('newEmail')}
          aria-invalid={Boolean(form.formState.errors.newEmail)}
          className="h-10 w-full rounded-lg border border-[var(--line)] px-3 text-[12px] aria-[invalid=true]:border-[var(--danger)]"
        />
        {form.formState.errors.newEmail && (
          <p className="mt-1 text-[10px] text-[var(--danger)]">
            {form.formState.errors.newEmail.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-3 text-[11px] font-semibold hover:bg-[var(--paper)]"
      >
        Request change <ArrowRight size={13} />
      </button>
    </form>
  </Panel>
);
