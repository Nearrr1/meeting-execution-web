'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { readableError } from '@/lib/auth-api';
import { useAuthApi, useAuthSessionQuery } from '@/queries/auth';
import { signInSchema, type SignInValues } from '@/lib/auth-schemas';
import { Divider, Field, FormError, OAuthButtons, SubmitButton } from '../form-primitives';

export const SignInForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useAuthSessionQuery();
  const { signIn } = useAuthApi();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  useEffect(() => {
    if (session.isSuccess) router.replace('/account');
  }, [router, session.isSuccess]);
  const submit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await signIn(values);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
      router.replace('/account');
    } catch (reason) {
      setError(readableError(reason));
    }
  });
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
        id="password"
        label="Password"
        type="password"
        placeholder="Your password"
        autoComplete="current-password"
        name="password"
        register={form.register}
        error={form.formState.errors.password?.message}
      />
      <div className="-mt-1 flex justify-end">
        <Link
          href="/forgot-password"
          className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] rounded text-[11px] font-semibold text-[var(--forest)] underline decoration-[var(--moss)] underline-offset-4"
        >
          Forgot password?
        </Link>
      </div>
      <FormError>{error}</FormError>
      <SubmitButton busy={form.formState.isSubmitting}>Sign in</SubmitButton>
      <Divider />
      <OAuthButtons />
      <p className="pt-2 text-center text-[12px] text-[var(--muted)]">
        New here?{' '}
        <Link
          href="/register"
          className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] rounded font-semibold text-[var(--forest)] underline decoration-[var(--moss)] underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
};
