import { AuthShell, VerifyEmailForm } from '@/components/auth';

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Readonly<VerifyEmailPageProps>) {
  const { email = '' } = await searchParams;
  return (
    <AuthShell
      eyebrow="One quick check"
      title="Check your inbox."
      description="Enter the six-digit code we sent to complete your account setup."
    >
      <VerifyEmailForm initialEmail={email} />
    </AuthShell>
  );
}
