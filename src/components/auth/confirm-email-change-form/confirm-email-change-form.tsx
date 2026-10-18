'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { readableError } from '@/lib/auth-api';
import { useAuthApi } from '@/queries/auth';
import { FormError, FormSuccess } from '../form-primitives';

type ConfirmEmailChangeFormProps = {
  token?: string;
};

export const ConfirmEmailChangeForm = ({ token = '' }: Readonly<ConfirmEmailChangeFormProps>) => {
  const { confirmEmailChange } = useAuthApi();
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const confirm = async () => {
    if (!token) {
      setError('This confirmation link is incomplete. Request another email change link.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await confirmEmailChange(token);
      setConfirmed(true);
    } catch (reason) {
      setError(readableError(reason));
    } finally {
      setBusy(false);
    }
  };
  if (confirmed)
    return (
      <div className="space-y-4">
        <FormSuccess>
          Your primary email has been updated. You can continue using your account.
        </FormSuccess>
        <Link
          href="/account"
          className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] inline-flex items-center gap-2 rounded-lg bg-[var(--forest)] px-4 py-3 text-[12px] font-semibold text-white"
        >
          Return to account <ArrowRight size={14} />
        </Link>
      </div>
    );
  return (
    <div className="space-y-4">
      <p className="text-[12px] leading-6 text-[var(--muted)]">
        Confirm that you control the new address. Your current email remains active until this step
        succeeds.
      </p>
      <FormError>{error}</FormError>
      <button
        type="button"
        onClick={confirm}
        disabled={busy}
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] flex h-[49px] w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--forest)] text-[13px] font-semibold text-white disabled:opacity-70"
      >
        {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={15} />}Confirm email
        change
      </button>
      <Link
        href="/account"
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] block rounded text-center text-[11px] font-semibold text-[var(--muted)] underline underline-offset-4"
      >
        Cancel
      </Link>
    </div>
  );
};
