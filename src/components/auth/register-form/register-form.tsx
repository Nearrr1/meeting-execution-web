'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { readableError } from '@/lib/auth-api';
import { useAuthApi } from '@/queries/auth';
import { registerSchema, type RegisterValues } from '@/lib/auth-schemas';
import { Field, FormError, SubmitButton } from '../form-primitives';

export const RegisterForm = () => {
  const router = useRouter();
  const { register: registerAccount } = useAuthApi();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', passwordConfirmation: '', displayName: '' },
  });
  const submit = form.handleSubmit(async ({ email, ...values }) => {
    setError(null);
    try {
      await registerAccount({ email, ...values });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (reason) {
      setError(readableError(reason));
    }
  });
  return (
    <form onSubmit={submit} className="space-y-3.5" noValidate>
      <Field
        id="displayName"
        label="Name (optional)"
        placeholder="How should we address you?"
        autoComplete="name"
        name="displayName"
        register={form.register}
      />
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
        id="password"
        label="Password"
        type="password"
        placeholder="Create a strong password"
        autoComplete="new-password"
        name="password"
        register={form.register}
        error={form.formState.errors.password?.message}
      />
      <Field
        id="passwordConfirmation"
        label="Confirm password"
        type="password"
        placeholder="Enter it again"
        autoComplete="new-password"
        name="passwordConfirmation"
        register={form.register}
        error={form.formState.errors.passwordConfirmation?.message}
      />
      <p className="text-[10px] leading-4 text-[var(--muted)]">
        At least 8 characters, with uppercase, lowercase, number, and symbol.
      </p>
      <FormError>{error}</FormError>
      <SubmitButton busy={form.formState.isSubmitting}>Create account</SubmitButton>
      <p className="pt-1 text-center text-[12px] text-[var(--muted)]">
        Already have an account?{' '}
        <Link
          href="/"
          className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] rounded font-semibold text-[var(--forest)] underline decoration-[var(--moss)] underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};
