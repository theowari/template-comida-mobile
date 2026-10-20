import { cn } from '../../lib/cn';
import { formatBRL } from '../../lib/format';
import type { CartTotals } from '../../lib/pricing';
import type { FulfillmentMode } from '../../types';

interface OrderSummaryProps {
  totals: Pick<CartTotals, 'subtotal' | 'deliveryFee' | 'discount' | 'total' | 'coupon'>;
  mode: FulfillmentMode;
  className?: string;
  /** Delivery fee is an estimate until the address is confirmed. */
  feeNote?: string;
}

/** Subtotal, fees and discounts, always in separate lines, then the total. */
export function OrderSummary({ totals, mode, className, feeNote }: OrderSummaryProps) {
  const couponCode = totals.coupon.state === 'applied' ? totals.coupon.coupon.code : null;
  return (
    <dl className={cn('space-y-2 text-[15px]', className)}>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-2">Subtotal</dt>
        <dd className="tabular">{formatBRL(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-2">
          {mode === 'retirada' ? 'Retirada na loja' : 'Taxa de entrega'}
          {feeNote ? <span className="block text-[12px]">{feeNote}</span> : null}
        </dt>
        <dd className="tabular">{totals.deliveryFee === 0 ? 'Grátis' : formatBRL(totals.deliveryFee)}</dd>
      </div>
      {totals.discount > 0 ? (
        <div className="flex justify-between gap-4 text-success">
          <dt>Desconto{couponCode ? ` (cupom ${couponCode})` : ''}</dt>
          <dd className="tabular font-medium">− {formatBRL(totals.discount)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-4 border-t border-line pt-3 text-[17px] font-bold">
        <dt>Total</dt>
        <dd className="tabular">{formatBRL(totals.total)}</dd>
      </div>
    </dl>
  );
}
