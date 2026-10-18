import { AuthShell, RecoveryForm } from '@/components/auth';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Find your way back."
      description="We’ll send recovery instructions if an account matches that address."
    >
      <RecoveryForm />
    </AuthShell>
  );
}
