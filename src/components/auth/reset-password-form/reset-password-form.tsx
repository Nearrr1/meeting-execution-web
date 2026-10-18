'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { readableError } from '@/lib/auth-api';
import { useAuthApi } from '@/queries/auth';
import { resetSchema, type ResetValues } from '@/lib/auth-schemas';
import { Field, FormError, SubmitButton } from '../form-primitives';

type ResetPasswordFormProps = {
  initialToken?: string;
};

export const ResetPasswordForm = ({ initialToken = '' }: Readonly<ResetPasswordFormProps>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { resetPassword } = useAuthApi();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { token: initialToken, newPassword: '', passwordConfirmation: '' },
  });
  const submit = form.handleSubmit(async ({ token, ...values }) => {
    setError(null);
    try {
      await resetPassword({ token, ...values });
      await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
      router.replace('/?passwordReset=1');
    } catch (reason) {
      setError(readableError(reason));
    }
  });
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input type="hidden" {...form.register('token')} />
      <Field
        id="newPassword"
        label="New password"
        type="password"
        placeholder="Create a strong password"
        autoComplete="new-password"
        name="newPassword"
        register={form.register}
        error={form.formState.errors.newPassword?.message}
      />
      <Field
        id="passwordConfirmation"
        label="Confirm new password"
        type="password"
        placeholder="Enter it again"
        autoComplete="new-password"
        name="passwordConfirmation"
        register={form.register}
        error={form.formState.errors.passwordConfirmation?.message}
      />
      <FormError>{error}</FormError>
      <SubmitButton busy={form.formState.isSubmitting}>Reset password</SubmitButton>
    </form>
  );
};
