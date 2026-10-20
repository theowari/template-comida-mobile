import { Check } from 'lucide-react';
import { checkoutSteps } from '../../lib/checkout';
import { cn } from '../../lib/cn';

export function CheckoutProgress({ current }: { current: number }) {
  return (
    <ol aria-label="Etapas do pedido" className="flex gap-1.5">
      {checkoutSteps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id} aria-current={active ? 'step' : undefined} className="min-w-0 flex-1">
            <span
              aria-hidden
              className={cn('block h-1.5 rounded-full transition-colors duration-200', done || active ? 'bg-brand' : 'bg-line-strong/70')}
            />
            <span
              className={cn(
                'mt-1.5 flex items-center gap-1 truncate text-[12px] leading-none',
                active ? 'font-bold text-ink' : done ? 'font-medium text-ink' : 'text-ink-2',
              )}
            >
              {done ? <Check className="size-3.5 shrink-0 text-success" strokeWidth={3} aria-hidden /> : null}
              <span className="truncate">{step.label}</span>
              <span className="sr-only">{done ? ' (concluída)' : active ? ' (etapa atual)' : ''}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
