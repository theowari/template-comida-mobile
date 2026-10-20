import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  /** Item name used in the accessible labels. */
  label: string;
  min?: number;
  max?: number;
  /** When set, the minus button becomes "remove" at the minimum. */
  onRemove?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 20,
  onRemove,
  size = 'md',
  className,
}: QuantityStepperProps) {
  const atMin = value <= min;
  const showRemove = atMin && Boolean(onRemove);
  const button = cn(
    'press grid shrink-0 place-items-center rounded-full text-brand transition-colors hover:bg-brand-50 disabled:text-ink-2/50 disabled:hover:bg-transparent',
    size === 'md' ? 'size-11' : 'size-10',
  );

  return (
    <div
      role="group"
      aria-label={`Quantidade de ${label}`}
      className={cn(
        'inline-flex items-center rounded-full border border-line-strong bg-surface',
        size === 'md' ? 'h-12 px-0.5' : 'h-11 px-px',
        className,
      )}
    >
      <button
        type="button"
        className={button}
        onClick={() => (showRemove ? onRemove?.() : onChange(value - 1))}
        disabled={atMin && !onRemove}
        aria-label={showRemove ? `Remover ${label} da sacola` : `Diminuir quantidade de ${label}`}
      >
        {showRemove ? <Trash2 className="size-[18px]" aria-hidden /> : <Minus className="size-[18px]" aria-hidden />}
      </button>
      <span className="tabular w-7 text-center text-[15px] font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Aumentar quantidade de ${label}`}
      >
        <Plus className="size-[18px]" aria-hidden />
      </button>
    </div>
  );
}
