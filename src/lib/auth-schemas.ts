import { z } from 'zod';

const password = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .refine((value) => /\p{Lu}/u.test(value), 'Add an uppercase letter.')
  .refine((value) => /\p{Ll}/u.test(value), 'Add a lowercase letter.')
  .refine((value) => /\p{N}/u.test(value), 'Add a number.')
  .refine((value) => /[^\p{L}\p{N}]/u.test(value), 'Add a symbol.');

export const signInSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const registerSchema = z
  .object({
    email: z.string().email(),
    password,
    passwordConfirmation: z.string().min(1),
    displayName: z.string().optional(),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match.',
  });
export const verifySchema = z.object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/) });
export const emailSchema = z.object({ email: z.string().email() });
export const resetSchema = z
  .object({
    token: z.string().min(1),
    newPassword: password,
    passwordConfirmation: z.string().min(1),
  })
  .refine((value) => value.newPassword === value.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match.',
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
export type EmailValues = z.infer<typeof emailSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
