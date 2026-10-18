'use client';

import type { SessionSummary } from '@/lib/auth-api';
import { Monitor } from 'lucide-react';
import { Panel, SectionHeading, SessionRow } from '../shared-ui';

type SessionsSectionProps = {
  sessions: SessionSummary[] | undefined;
  loading: boolean;
  error: string | null;
  currentSessionExpiry: string;
  onRevoke: (id: string) => void;
  onSignOut: () => void;
};

export const SessionsSection = ({
  sessions,
  loading,
  error,
  currentSessionExpiry,
  onRevoke,
  onSignOut,
}: SessionsSectionProps) => (
  <Panel>
    <SectionHeading
      icon={Monitor}
      title="Active sessions"
      detail="Sign out any device you no longer use. Session secrets are never shown here."
    />
    {loading ? (
      <p className="text-[12px] text-[var(--muted)]">Loading sessions…</p>
    ) : error ? (
      <p role="alert" className="text-[12px] leading-5 text-[var(--muted)]">
        {error}
      </p>
    ) : (
      <div className="divide-y divide-[var(--line)]">
        {sessions?.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            current={session.absoluteExpiresAt === currentSessionExpiry}
            onRevoke={onRevoke}
            onSignOut={onSignOut}
          />
        ))}
      </div>
    )}
  </Panel>
);
