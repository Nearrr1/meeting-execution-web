'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiRequestError, oidcStartUrl, readableError, type Provider } from '@/lib/auth-api';
import { useAccountApi } from '@/queries/account';
import { DeletionScheduled } from '../shared-ui';
import { AccountDetailsSection } from '../account-details-section';
import { IdentitySection } from '../identity-section';
import { LifecycleSection } from '../lifecycle-section';
import { SessionsSection } from '../sessions-section';
import { ArrowLeft, CircleHelp, Fingerprint, LoaderCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { SecureIntent } from '@/types';
import { ReauthenticationDialog } from '../reauthentication-dialog';

const REAUTH_MARKER = 'mee:reauthenticated-until';

const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8)
      .refine((v) => /\p{Lu}/u.test(v), 'Add an uppercase letter.')
      .refine((v) => /\p{Ll}/u.test(v), 'Add a lowercase letter.')
      .refine((v) => /\p{N}/u.test(v), 'Add a number.')
      .refine((v) => /[^\p{L}\p{N}]/u.test(v), 'Add a symbol.'),
    passwordConfirmation: z.string().min(1),
  })
  .refine((v) => v.newPassword === v.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match.',
  });
const emailChangeSchema = z.object({ newEmail: z.string().email() });

function rememberReauthentication() {
  sessionStorage.setItem(REAUTH_MARKER, String(Date.now() + 10 * 60_000));
}

function consumeReauthentication(): boolean {
  const expiresAt = Number(sessionStorage.getItem(REAUTH_MARKER));
  sessionStorage.removeItem(REAUTH_MARKER);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export const AccountPanel = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [intent, setIntent] = useState<SecureIntent | null>(null);
  const [reauthPassword, setReauthPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deletion, setDeletion] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const accountApi = useAccountApi();
  const { accountQuery, sessionsQuery: sessionQuery, identitiesQuery: identityQuery } = accountApi;
  const emailForm = useForm<{ newEmail: string }>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: { newEmail: '' },
  });
  const passwordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: '', passwordConfirmation: '' },
  });
  const account = accountQuery.data?.account;
  const sessionInfo = accountQuery.data?.session;
  const identities = identityQuery.data?.identities ?? account?.identities ?? [];
  const hasLocalCredential = identities.some((identity) => identity.provider === 'local');

  useEffect(() => {
    if (accountQuery.error instanceof ApiRequestError && accountQuery.error.status === 401)
      router.replace('/');
  }, [accountQuery.error, router]);

  const signOut = useMutation({
    mutationFn: accountApi.signOut,
    onSuccess: () => {
      queryClient.clear();
      router.replace('/');
    },
    onError: (reason) => setError(readableError(reason)),
  });

  const executeIntent = async (target: SecureIntent, currentPassword?: string) => {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (target.kind === 'link') {
        window.location.assign(oidcStartUrl(target.provider, { intent: 'link', returnTo: '/account' }));
        return;
      }
      if (target.kind === 'unlink') {
        await accountApi.unlinkIdentity(target.identityId);
        await queryClient.invalidateQueries({ queryKey: ['auth'] });
        setNotice('The sign-in method has been removed.');
      }
      if (target.kind === 'email') {
        const values = emailForm.getValues();
        const parsed = emailChangeSchema.safeParse(values);
        if (!parsed.success) {
          emailForm.setError('newEmail', { message: parsed.error.issues[0]?.message });
          setBusy(false);
          return;
        }
        await accountApi.requestEmailChange(parsed.data);
        setNotice(
          'If the address can be changed, a confirmation link has been sent. Your current email stays active until confirmation.',
        );
        emailForm.reset();
      }
      if (target.kind === 'password') {
        const parsed = newPasswordSchema.safeParse(passwordForm.getValues());
        if (!parsed.success) {
          for (const issue of parsed.error.issues)
            if (issue.path[0] === 'newPassword' || issue.path[0] === 'passwordConfirmation')
              passwordForm.setError(issue.path[0], { message: issue.message });
          setBusy(false);
          return;
        }
        if (!currentPassword) {
          setError('Enter your current password to change it.');
          setBusy(false);
          return;
        }
        await accountApi.changePassword({ currentPassword, ...parsed.data });
        setNotice('Your password has been changed. Other sessions have been signed out.');
        passwordForm.reset();
        setShowPasswordForm(false);
        await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
      }
      if (target.kind === 'disable') {
        await accountApi.disableAccount();
        queryClient.clear();
        router.replace('/?accountDisabled=1');
        return;
      }
      if (target.kind === 'delete') {
        const result = await accountApi.requestDeletion();
        queryClient.clear();
        setDeletion(result.purgeAt);
        setIntent(null);
        setBusy(false);
        return;
      }
      setIntent(null);
    } catch (reason) {
      setError(readableError(reason));
    } finally {
      setBusy(false);
      setIntent(null);
    }
  };

  const beginSecureAction = async (next: SecureIntent) => {
    setError(null);
    setNotice(null);
    setIntent(next);
    setReauthPassword('');
    if (consumeReauthentication()) {
      setIntent(null);
      await executeIntent(next);
    }
  };

  const reauthenticateWithPassword = async () => {
    if (!intent || !reauthPassword) {
      setError('Enter your current password to continue.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await accountApi.reauthenticateWithPassword(reauthPassword);
      rememberReauthentication();
      await executeIntent(intent, reauthPassword);
    } catch (reason) {
      setError(readableError(reason));
    } finally {
      setBusy(false);
    }
  };

  const reauthenticateWithProvider = async (provider: Provider) => {
    setBusy(true);
    setError(null);
    try {
      const result = await accountApi.reauthenticateWithProvider(provider);
      rememberReauthentication();
      window.location.assign(result.authorizationUrl);
    } catch (reason) {
      setBusy(false);
      setError(readableError(reason));
    }
  };

  const revokeSession = async (id: string) => {
    setError(null);
    try {
      await accountApi.revokeSession(id);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
      setNotice('Session signed out.');
    } catch (reason) {
      setError(readableError(reason));
    }
  };

  if (deletion) return <DeletionScheduled purgeAt={deletion} />;

  if (accountQuery.isLoading || !account || !sessionInfo) {
    if (
      accountQuery.isError &&
      !(accountQuery.error instanceof ApiRequestError && accountQuery.error.status === 401)
    ) {
      return (
        <main className="grid min-h-screen place-items-center bg-[var(--paper)] p-5">
          <div className="max-w-md rounded-2xl border border-[var(--line)] bg-white p-7 text-center">
            <p className="font-serif text-3xl">Your account could not load.</p>
            <p role="alert" className="mt-3 text-[12px] leading-5 text-[var(--muted)]">
              {readableError(accountQuery.error)}
            </p>
            <button
              onClick={() => void accountQuery.refetch()}
              className={cn(
                'focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px]',
                'mt-5 rounded-lg bg-[var(--forest)] px-4 py-3 text-[12px] font-semibold text-white',
              )}
            >
              Try again
            </button>
          </div>
        </main>
      );
    }

    return (
      <main className="grid min-h-screen place-items-center bg-[var(--paper)]">
        <output className="flex items-center gap-3 text-sm text-[var(--muted)]">
          <LoaderCircle className="animate-spin" size={18} />
          Loading your private space…
        </output>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-[1080px]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
          <Link
            href="/"
            className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] flex items-center gap-3 rounded-md"
          >
            <span className="grid size-10 place-items-center rounded-full bg-[var(--forest)] text-[var(--acid)]">
              <Fingerprint size={19} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[.17em]">Meeting / Execution</span>
          </Link>
          <button
            onClick={() => signOut.mutate()}
            disabled={signOut.isPending}
            className={cn(
              'focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px]',
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold text-[var(--muted)]',
              'hover:bg-white hover:text-[var(--ink)]',
            )}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:py-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--coral)]">
              Account and access
            </p>
            <h1 className="mt-2 font-serif text-5xl tracking-[-.045em]">
              Your space, <em>{account.displayName || 'in order'}.</em>
            </h1>
            <p className="mt-3 max-w-[560px] text-[13px] leading-6 text-[var(--muted)]">
              Manage sign-in methods, sessions, and account security. Your meeting space stays private to
              this account.
            </p>
            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-[#e7c2b6] bg-[#fff5f0] p-3 text-[12px] text-[var(--danger)]"
              >
                {error}
              </p>
            )}
            {notice && (
              <output className="mt-5 rounded-xl border border-[#bfd2c4] bg-[#f0f6ef] p-3 text-[12px] leading-5 text-[var(--success)]">
                {notice}
              </output>
            )}

            <div className="mt-7 space-y-4">
              <AccountDetailsSection
                displayName={account.displayName}
                primaryEmail={account.primaryEmail.address}
                form={emailForm}
                onRequestChange={() => beginSecureAction({ kind: 'email' })}
              />

              <IdentitySection
                identities={identities}
                showPasswordForm={showPasswordForm}
                passwordForm={passwordForm}
                onSecureAction={beginSecureAction}
                onTogglePassword={() => setShowPasswordForm((visible) => !visible)}
              />

              <SessionsSection
                sessions={sessionQuery.data?.sessions}
                loading={sessionQuery.isLoading}
                error={sessionQuery.isError ? readableError(sessionQuery.error) : null}
                currentSessionExpiry={sessionInfo.absoluteExpiresAt}
                onRevoke={revokeSession}
                onSignOut={() => signOut.mutate()}
              />
              <LifecycleSection onSecureAction={beginSecureAction} />
            </div>
          </div>

          <aside className="space-y-4 lg:pt-1">
            <div className="rounded-2xl bg-[var(--forest)] p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--acid)]">
                Session status
              </p>
              <p className="mt-3 font-serif text-2xl">Private space active</p>
              <p className="mt-2 text-[11px] leading-5 text-white/65">
                Your account is the only authority for this personal space.
              </p>
              <div className="mt-5 border-t border-white/15 pt-4 text-[10px] text-white/65">
                <span className="block uppercase tracking-[.12em]">Absolute session expiry</span>
                <span className="mt-1 block text-[12px] text-white">
                  {new Date(sessionInfo.absoluteExpiresAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[#e9ede5] p-5">
              <div className="flex items-center gap-2 text-[var(--forest)]">
                <CircleHelp size={15} />
                <p className="text-[11px] font-semibold">Need help?</p>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[var(--muted)]">
                Account recovery and reactivation require ownership verification through support.
              </p>
            </div>
            <Link
              href="/"
              className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] inline-flex items-center gap-2 rounded-md text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <ArrowLeft size={13} />
              Back
            </Link>
          </aside>
        </div>

        {intent && (
          <ReauthenticationDialog
            intent={intent}
            error={error}
            busy={busy}
            hasLocalCredential={hasLocalCredential}
            identities={identities}
            password={reauthPassword}
            onPasswordChange={(event) => setReauthPassword(event.target.value)}
            onPasswordKeyDown={(event) => {
              if (event.key === 'Enter') void reauthenticateWithPassword();
            }}
            onReauthenticateWithPassword={reauthenticateWithPassword}
            onReauthenticateWithProvider={reauthenticateWithProvider}
            onCancel={() => setIntent(null)}
          />
        )}
      </div>
    </main>
  );
};
