import { Check, X } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface ToggleChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  label: string;
}

/** Selectable chip. Selected = red outline, red label and a check (never color alone). */
export function ToggleChip({ selected, label, className, ...rest }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'press inline-flex h-10 items-center gap-1.5 rounded-full border-[1.5px] px-4 text-sm font-medium transition-[background-color,border-color,color] duration-150',
        selected
          ? 'border-brand bg-brand-50 text-brand-dark'
          : 'border-line-strong bg-surface text-ink hover:border-ink/40',
        className,
      )}
      {...rest}
    >
      {selected ? <Check className="-ml-1 size-4" strokeWidth={2.5} aria-hidden /> : null}
      {label}
    </button>
  );
}

interface RemovableChipProps {
  label: string;
  onRemove: () => void;
}

/** Active filter shown under the search bar. */
export function RemovableChip({ label, onRemove }: RemovableChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remover filtro: ${label}`}
      className="press inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-brand-50 pr-2 pl-3 text-[13px] font-medium text-brand-dark transition-colors hover:border-brand/60"
    >
      {label}
      <X className="size-4" strokeWidth={2.25} aria-hidden />
    </button>
  );
}
