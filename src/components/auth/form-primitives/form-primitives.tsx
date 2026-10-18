'use client';

import { useState, type InputHTMLAttributes } from 'react';
import { type FieldPath, type FieldValues, type UseFormRegister } from 'react-hook-form';
import { ArrowRight, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { oidcStartUrl, type Provider } from '@/lib/auth-api';

type FieldProps<TFieldValues extends FieldValues> = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  register: UseFormRegister<TFieldValues>;
  name: FieldPath<TFieldValues>;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
};

type FormMessageProps = {
  children: string | null;
};

type SubmitButtonProps = {
  children: string;
  busy: boolean;
};

export const Field = <TFieldValues extends FieldValues>({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  error,
  register,
  name,
  inputMode,
  maxLength,
}: Readonly<FieldProps<TFieldValues>>) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && visible ? 'text' : type;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[12px] font-semibold text-[var(--ink)]">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-[48px] text-[13px]"
          {...register(name)}
        />
        {isPassword && (
          <button
            type="button"
            className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[var(--muted)] hover:text-[var(--ink)]"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[11px] text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
};

export const FormError = ({ children }: Readonly<FormMessageProps>) => {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-[#e7c2b6] bg-[#fff5f0] px-3 py-2.5 text-[12px] leading-5 text-[var(--danger)]"
    >
      {children}
    </p>
  );
};

export const FormSuccess = ({ children }: Readonly<FormMessageProps>) => {
  if (!children) return null;
  return (
    <output className="rounded-lg border border-[#bfd2c4] bg-[#f0f6ef] px-3 py-2.5 text-[12px] leading-5 text-[var(--success)]">
      {children}
    </output>
  );
};

export const SubmitButton = ({ children, busy }: Readonly<SubmitButtonProps>) => {
  return (
    <Button type="submit" disabled={busy} size="large" className="w-full disabled:cursor-wait">
      {busy ? (
        <LoaderCircle size={16} className="animate-spin" />
      ) : (
        <>
          {children}
          <ArrowRight size={15} />
        </>
      )}
    </Button>
  );
};

export const OAuthButtons = () => {
  const [pending, setPending] = useState<Provider | null>(null);
  const start = (provider: Provider) => {
    setPending(provider);
    window.location.assign(oidcStartUrl(provider, { returnTo: '/' }));
  };
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={() => start('google')}
        disabled={pending !== null}
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] flex h-[46px] items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-white text-[12px] font-semibold hover:bg-[var(--paper)] disabled:opacity-60"
      >
        <span aria-hidden="true" className="font-bold text-[#4285f4]">
          G
        </span>
        {pending === 'google' ? 'Opening…' : 'Google'}
      </button>
      <button
        type="button"
        onClick={() => start('microsoft')}
        disabled={pending !== null}
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] flex h-[46px] items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-white text-[12px] font-semibold hover:bg-[var(--paper)] disabled:opacity-60"
      >
        <span aria-hidden="true" className="grid size-3 grid-cols-2 gap-[2px]">
          <i className="bg-[#f25022]" />
          <i className="bg-[#7fba00]" />
          <i className="bg-[#00a4ef]" />
          <i className="bg-[#ffb900]" />
        </span>
        {pending === 'microsoft' ? 'Opening…' : 'Microsoft'}
      </button>
    </div>
  );
};

export const Divider = () => {
  return (
    <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[.15em] text-[#98a19a]">
      <span className="h-px flex-1 bg-[var(--line)]" />
      {''}
      or continue with
      <span className="h-px flex-1 bg-[var(--line)]" />
    </div>
  );
};
