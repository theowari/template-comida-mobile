import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface IconTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  /** Count shown in the corner badge. Hidden when 0 or undefined. */
  badge?: number;
}

/** The white rounded tile buttons from the header (menu, notifications, bag). */
export function IconTile({ icon: Icon, label, badge, className, ...rest }: IconTileProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'press relative grid size-11 shrink-0 place-items-center rounded-tile bg-surface text-ink shadow-tile transition-[box-shadow,background-color] duration-150 hover:bg-surface-hover hover:shadow-tile-hover',
        className,
      )}
      {...rest}
    >
      <Icon className="size-[22px]" strokeWidth={1.8} aria-hidden />
      {badge ? <CountBadge count={badge} className="absolute -top-1.5 -right-1.5" /> : null}
    </button>
  );
}

export function CountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'tabular grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] leading-none font-bold text-white ring-2 ring-ground',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
