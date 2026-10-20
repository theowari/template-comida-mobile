import { Bike } from 'lucide-react';
import { store } from '../../data/store';
import { cn } from '../../lib/cn';
import { formatBRL } from '../../lib/format';

/** Time, fee and minimum before the visitor starts choosing. */
export function DeliveryInfo({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-start gap-2 text-[13px] leading-snug text-ink-2 lg:text-[14px]', className)}>
      <Bike className="mt-px size-4 shrink-0 text-ink lg:size-[18px]" strokeWidth={1.9} aria-hidden />
      <span>
        {/* Each fact stays whole; lines break between facts, never inside one. */}
        <span className="whitespace-nowrap">
          Entrega <span className="font-semibold text-ink">{store.delivery.estimate}</span>
        </span>
        <span aria-hidden> · </span>
        <span className="whitespace-nowrap">
          Taxa <span className="tabular font-semibold text-ink">{formatBRL(store.delivery.fee)}</span>
        </span>
        <span aria-hidden> · </span>
        <span className="whitespace-nowrap">
          Mínimo <span className="tabular font-semibold text-ink">{formatBRL(store.delivery.minOrder)}</span>
        </span>
      </span>
    </p>
  );
}
