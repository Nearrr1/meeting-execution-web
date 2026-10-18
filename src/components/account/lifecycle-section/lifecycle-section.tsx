'use client';

import { ShieldCheck, Trash2 } from 'lucide-react';
import { Panel, SectionHeading } from '../shared-ui';
import type { SecureIntent } from '@/types';

type LifecycleSectionProps = { onSecureAction: (intent: SecureIntent) => void };

export const LifecycleSection = ({ onSecureAction }: LifecycleSectionProps) => (
  <Panel className="border-[#e7d7ca]">
    <SectionHeading
      icon={ShieldCheck}
      title="Account lifecycle"
      detail="These actions sign out every active session."
    />
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSecureAction({ kind: 'disable' })}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--line)] px-3 text-[11px] font-semibold hover:bg-[var(--paper)]"
      >
        Disable account
      </button>
      <button
        onClick={() => onSecureAction({ kind: 'delete' })}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4c3b7] px-3 text-[11px] font-semibold text-[var(--danger)] hover:bg-[#fff5f0]"
      >
        <Trash2 size={13} />
        Request deletion
      </button>
    </div>
    <p className="mt-3 text-[10px] leading-5 text-[var(--muted)]">
      Deletion is scheduled, not immediate. Data is purged within the approved 30-day window.
    </p>
  </Panel>
);
