import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        'focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] h-11 w-full rounded-[10px] border border-[var(--line)] bg-white px-3.5 text-[12px] text-[var(--ink)] placeholder:text-[#9aa39d] transition-colors focus:border-[var(--forest)] aria-[invalid=true]:border-[var(--danger)]',
        className,
      )}
      {...props}
    />
  );
};
