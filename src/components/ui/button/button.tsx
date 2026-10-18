import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonStyles = cva(
  'focus-visible:outline-2 focus-visible:outline-[var(--coral)] focus-visible:outline-offset-[3px] inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--forest)] text-white hover:bg-[var(--forest-deep)]',
        outline: 'border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--paper)]',
        quiet: 'text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]',
        danger: 'border border-[#e4c3b7] text-[var(--danger)] hover:bg-[#fff5f0]',
      },
      size: {
        default: 'h-11 px-4 text-[12px]',
        small: 'h-9 px-3 text-[11px]',
        large: 'h-[49px] px-4 text-[13px]',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & { asChild?: boolean };

export const Button = ({ asChild = false, variant, size, className, ...props }: ButtonProps) => {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn(buttonStyles({ variant, size }), className)} {...props} />;
};
