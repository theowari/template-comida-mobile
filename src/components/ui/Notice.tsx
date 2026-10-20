import { Info, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface NoticeProps {
  children: ReactNode;
  tone?: 'info' | 'warning';
  className?: string;
}

/** Inline notice for demo labels, warnings and context that must not be missed. */
export function Notice({ children, tone = 'info', className }: NoticeProps) {
  const Icon = tone === 'warning' ? TriangleAlert : Info;
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[13px] leading-snug',
        tone === 'warning' ? 'bg-warning-50 text-[#5c3700]' : 'bg-ground-2 text-ink-2',
        className,
      )}
    >
      <Icon className={cn('mt-px size-4 shrink-0', tone === 'warning' ? 'text-warning' : 'text-ink-2')} aria-hidden />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
