import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  headingLevel?: 'h2' | 'h3';
}

export function EmptyState({ icon: Icon, title, children, actions, className, headingLevel = 'h2' }: EmptyStateProps) {
  const Heading = headingLevel;
  return (
    <div className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand">
        <Icon className="size-7" strokeWidth={1.8} aria-hidden />
      </span>
      <Heading className="mt-4 text-lg font-bold tracking-[-0.01em]">{title}</Heading>
      {children ? <div className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-ink-2">{children}</div> : null}
      {actions ? <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div> : null}
    </div>
  );
}
