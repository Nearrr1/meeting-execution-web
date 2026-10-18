import { AuthShell, SignInForm } from '@/components/auth';

type SignInPageProps = {
  searchParams: Promise<{ passwordReset?: string; accountDisabled?: string }>;
};

export default async function SignInPage({ searchParams }: Readonly<SignInPageProps>) {
  const { passwordReset, accountDisabled } = await searchParams;
  return (
    <AuthShell
      eyebrow="Your workspace starts here"
      title="Welcome back."
      description="Sign in to pick up where the conversation left off."
    >
      {passwordReset === '1' && (
        <output className="mb-4 rounded-lg border border-[#bfd2c4] bg-[#f0f6ef] px-3 py-2.5 text-[12px] text-[var(--success)]">
          Password reset. You can sign in with your new password.
        </output>
      )}
      {accountDisabled === '1' && (
        <output className="mb-4 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-[12px] leading-5 text-[var(--muted)]">
          Your account has been disabled. Contact support if you need help restoring access.
        </output>
      )}
      <SignInForm />
    </AuthShell>
  );
}
