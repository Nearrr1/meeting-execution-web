import { AuthShell, ConfirmEmailChangeForm } from '@/components/auth';

type ConfirmEmailChangePageProps = {
  searchParams: Promise<{ token?: string }>;
};

const ConfirmEmailChangePage = async ({ searchParams }: ConfirmEmailChangePageProps) => {
  const { token = '' } = await searchParams;
  return (
    <AuthShell
      eyebrow="Confirm account change"
      title="Verify the new address."
      description="This confirmation link is single-use and expires after 30 minutes."
    >
      <ConfirmEmailChangeForm token={token} />
    </AuthShell>
  );
};

export default ConfirmEmailChangePage;
