import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Clock3, LoaderCircle, Monitor } from 'lucide-react';
import Link from 'next/link';
import type { SessionSummary } from '@/lib/auth-api';
import { cn } from '@/lib/cn';

type PanelProps = { children: ReactNode; className?: string };
type SectionHeadingProps = { icon: LucideIcon; title: string; detail: string };
type BusyLabelProps = { busy: boolean; children: ReactNode };
type DeletionScheduledProps = { purgeAt: string };
type SessionRowProps = {
  session: SessionSummary;
  current: boolean;
  onRevoke: (id: string) => void;
  onSignOut: () => void;
};

export const Panel = ({ children, className }: PanelProps) => (
  <section className={cn('rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6', className)}>
    {children}
  </section>
);

export const SectionHeading = ({ icon: Icon, title, detail }: SectionHeadingProps) => (
  <div className="mb-5 flex items-start gap-3">
    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eef1e9] text-[var(--forest)]">
      <Icon size={17} />
    </span>
    <div>
      <h2 className="text-[14px] font-semibold">{title}</h2>
      <p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">{detail}</p>
    </div>
  </div>
);

export const BusyLabel = ({ busy, children }: BusyLabelProps) => (
  <>
    {busy ? <LoaderCircle size={14} className="animate-spin" /> : <ArrowRight size={14} />}
    <span>{children}</span>
  </>
);

export const SessionRow = ({ session, current, onRevoke, onSignOut }: SessionRowProps) => (
  <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--paper)] text-[var(--muted)]">
        <Monitor size={14} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold">
          {session.userAgentLabel || 'Signed-in device'}
          {current && (
            <span className="ml-2 rounded-full bg-[#e9ede5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--forest)]">
              This device
            </span>
          )}
        </p>
        <p className="text-[10px] text-[var(--muted)]">
          Last active {new Date(session.lastSeenAt).toLocaleString()}
        </p>
      </div>
    </div>
    {current ? (
      <button
        onClick={onSignOut}
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] shrink-0 rounded-md px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] hover:bg-[var(--paper)]"
      >
        Sign out
      </button>
    ) : (
      <button
        onClick={() => onRevoke(session.id)}
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] shrink-0 rounded-md px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] hover:bg-[var(--paper)]"
      >
        Revoke
      </button>
    )}
  </div>
);

export const DeletionScheduled = ({ purgeAt }: DeletionScheduledProps) => (
  <main className="min-h-screen bg-[var(--paper)] px-5 py-12">
    <div className="mx-auto max-w-[620px] rounded-3xl border border-[var(--line)] bg-white p-8 sm:p-12">
      <div className="grid size-12 place-items-center rounded-full bg-[#f7ede6] text-[var(--coral)]">
        <Clock3 />
      </div>
      <h1 className="mt-6 font-serif text-4xl tracking-tight">
        Your account is scheduled for deletion.
      </h1>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        Your sessions have ended. The account data purge is scheduled for{' '}
        <strong className="text-[var(--ink)]">{new Date(purgeAt).toLocaleString()}</strong>. Contact
        support if you requested this in error.
      </p>
      <Link
        href="/"
        className="focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--forest)] px-4 py-3 text-sm font-semibold text-white"
      >
        Return to sign in <ArrowRight size={15} />
      </Link>
    </div>
  </main>
);
