'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { readableError } from '@/lib/auth-api';
import { useAuthApi } from '@/queries/auth';
import { emailSchema, verifySchema, type VerifyValues } from '@/lib/auth-schemas';
import { Field, FormError, FormSuccess, SubmitButton } from '../form-primitives';

type VerifyEmailFormProps = {
  initialEmail?: string;
};

export const VerifyEmailForm = ({ initialEmail = '' }: Readonly<VerifyEmailFormProps>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { verifyEmail, resendEmailOtp } = useAuthApi();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: initialEmail, code: '' },
  });
  const submit = form.handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);
    try {
      await verifyEmail(values);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
      router.replace('/account');
    } catch (reason) {
      setError(readableError(reason));
    }
  });
  const resend = async () => {
    const parsed = emailSchema.safeParse({ email: form.getValues('email') });
    if (!parsed.success) {
      form.setError('email', { message: 'Enter the email address used to register.' });
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await resendEmailOtp(parsed.data);
      setSuccess('If a verification is available, a new code has been sent.');
    } catch (reason) {
      setError(readableError(reason));
    }
  };
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
      <Field
        id="code"
        label="Six-digit verification code"
        placeholder="000000"
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={6}
        name="code"
        register={form.register}
        error={form.formState.errors.code?.message}
      />
      <p className="text-[11px] leading-5 text-[var(--muted)]">
        The code expires after 10 minutes. Check your inbox and spam folder.
      </p>
      <FormError>{error}</FormError>
      <FormSuccess>{success}</FormSuccess>
      <SubmitButton busy={form.formState.isSubmitting}>Verify email</SubmitButton>
      <button
        type="button"
        onClick={resend}
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] mx-auto block rounded text-[11px] font-semibold text-[var(--forest)] underline decoration-[var(--moss)] underline-offset-4"
      >
        Send another code
      </button>
    </form>
  );
};
