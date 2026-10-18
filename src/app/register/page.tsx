import { AuthShell, RegisterForm } from '@/components/auth';

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Start with a clear next step"
      title="Create your space."
      description="One private place for meetings, decisions, and the work that follows."
    >
      <RegisterForm />
    </AuthShell>
  );
}
