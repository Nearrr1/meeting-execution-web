import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, Check, CircleDot, Orbit } from 'lucide-react';
import styles from './auth-shell.module.scss';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export const AuthShell = ({ eyebrow, title, description, children }: AuthShellProps) => {
  return (
    <main className={styles.authMain}>
      <div className={styles.authCard}>
        <aside className={styles.authBrand}>
          <div className="relative z-10 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/5 text-[var(--acid)]">
              <Orbit size={19} strokeWidth={1.6} />
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[.2em]">
              Meeting / Execution
            </span>
          </div>

          <div className="relative z-10 max-w-[510px] pb-5">
            <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.2em] text-[var(--acid)]">
              <CircleDot size={13} /> From conversation to progress
            </p>
            <h2 className="font-serif text-[clamp(3.5rem,6vw,6.3rem)] leading-[.91] tracking-[-.055em]">
              Make the
              <br />
              next step
              <br />
              <em className="font-light text-[var(--acid)]">obvious.</em>
            </h2>
            <p className="mt-7 max-w-[360px] text-[15px] leading-7 text-white/65">
              Keep the meaning of the meeting. Give every decision a clear way forward.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[.12em] text-white/55">
            {['Capture', 'Clarify', 'Carry forward'].map((label, index) => (
              <div className="flex items-center gap-2" key={label}>
                <span className="grid size-5 place-items-center rounded-full border border-white/20 text-[9px] text-[var(--acid)]">
                  {index + 1}
                </span>
                {label}
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-16 top-[27%] size-[300px] rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-5 top-[32%] size-[180px] rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute right-[70px] top-[43%] size-3 rounded-full bg-[var(--acid)] shadow-[0_0_34px_12px_rgba(210,230,125,.26)]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[27%] right-[26%] h-20 w-px rotate-[38deg] bg-white/20"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[23%] right-[22%] flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-2 text-[10px] text-white/75 backdrop-blur-sm"
          >
            <Check size={12} className="text-[var(--acid)]" /> Decision ready
          </div>
        </aside>

        <section className={styles.authFormPanel}>
          <div className="mb-12 flex items-center justify-between lg:mb-0">
            <Link
              className={`${styles.focusRing} flex items-center gap-2.5 rounded-md lg:invisible`}
              href="/"
            >
              <Orbit size={18} className="text-[var(--forest)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[.16em]">
                Meeting / Execution
              </span>
            </Link>
            <Link
              href="/"
              aria-label="Home"
              className={`${styles.focusRing} hidden rounded-full p-2 text-[var(--muted)] hover:bg-[var(--paper)] lg:block`}
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className={styles.content}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--coral)]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(2.7rem,4vw,3.7rem)] leading-[1.02] tracking-[-.045em]">
              {title}
            </h1>
            <p className="mt-3 max-w-[360px] text-[14px] leading-6 text-[var(--muted)]">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
          <footer className={styles.footer}>
            <span>Private by design</span>
            <span>© {new Date().getFullYear()} Meeting / Execution</span>
          </footer>
        </section>
      </div>
    </main>
  );
};
