'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { readableError } from '@/lib/auth-api';
import { useAuthApi } from '@/queries/auth';
import { emailSchema, type EmailValues } from '@/lib/auth-schemas';
import { Field, FormError, SubmitButton } from '../form-primitives';

export const RecoveryForm = () => {
  const { requestPasswordRecovery } = useAuthApi();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const form = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });
  const submit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await requestPasswordRecovery(values);
      setSent(true);
    } catch (reason) {
      setError(readableError(reason));
    }
  });
  if (sent)
    return (
      <div className="space-y-4">
        <output className="rounded-xl border border-[var(--line)] bg-white p-4 text-[13px] leading-6 text-[var(--muted)]">
          If an account matches that address, recovery instructions will arrive shortly.
        </output>
        <Link
          href="/"
          className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] inline-flex rounded text-[12px] font-semibold text-[var(--forest)] underline decoration-[var(--moss)] underline-offset-4"
        >
          Back to sign in
        </Link>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field
        id="email"
        label="Email address"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        name="email"
        register={form.register}
        error={form.formState.errors.email?.message}
      />
      <FormError>{error}</FormError>
      <SubmitButton busy={form.formState.isSubmitting}>Send recovery link</SubmitButton>
      <p className="text-center">
        <Link
          href="/"
          className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] rounded text-[11px] font-semibold text-[var(--forest)] underline decoration-[var(--moss)] underline-offset-4"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
