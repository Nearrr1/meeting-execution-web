import { AuthShell, ResetPasswordForm } from '@/components/auth';

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Readonly<ResetPasswordPageProps>) {
  const { token = '' } = await searchParams;
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password."
      description="Your new password will sign out other active sessions."
    >
      <ResetPasswordForm initialToken={token} />
    </AuthShell>
  );
}
