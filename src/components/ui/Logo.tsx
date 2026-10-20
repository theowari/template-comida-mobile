import { cn } from '../../lib/cn';

/** Original mark: a pizza slice with a crust line, in a red rounded tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="9" fill="#D71935" />
      <path d="M16 27.5 5.6 9.6C12 5.9 20 5.9 26.4 9.6Z" fill="#fff" />
      <path d="M8.2 11.4c4.9-2.5 10.7-2.5 15.6 0" fill="none" stroke="#D71935" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="13" cy="15.2" r="1.8" fill="#D71935" />
      <circle cx="19" cy="14.6" r="1.6" fill="#D71935" />
      <circle cx="16" cy="20.4" r="1.5" fill="#D71935" />
    </svg>
  );
}

export function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className={size === 'lg' ? 'size-9' : 'size-8'} />
      <span
        className={cn(
          'font-display leading-none font-extrabold tracking-[-0.01em] whitespace-nowrap text-ink italic',
          size === 'lg' ? 'text-[32px]' : 'text-[27px]',
        )}
      >
        Seu <span className="text-brand">negócio</span>
      </span>
    </span>
  );
}
