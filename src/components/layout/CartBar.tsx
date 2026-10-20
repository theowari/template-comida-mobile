import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useOverlay } from '../../hooks/useOverlay';
import { formatBRL, pluralize } from '../../lib/format';

/**
 * Floating bag bar above the bottom navigation (phones and tablets):
 * count and subtotal always one tap away, as in delivery apps.
 */
export function CartBar() {
  const { totals } = useCart();
  const bag = useOverlay('sacola');
  if (totals.itemCount === 0) return null;

  return (
    <div
      className="cart-bar fixed inset-x-0 z-30 lg:hidden"
      style={{ bottom: 'calc(64px + max(8px, env(safe-area-inset-bottom)) + 10px)' }}
    >
      <div className="mx-auto max-w-[560px] px-3">
        <button
          type="button"
          onClick={() => bag.open()}
          className="press flex h-14 w-full items-center gap-3 rounded-2xl bg-ink pr-3 pl-2 text-white shadow-[0_14px_28px_-12px_rgb(23_17_15/0.55)]"
        >
          <span className="relative grid size-10 place-items-center rounded-xl bg-brand">
            <ShoppingBag className="size-5" strokeWidth={2} aria-hidden />
          </span>
          <span className="min-w-0 flex-1 text-left leading-tight">
            <span className="block text-[15px] font-semibold">Ver sacola</span>
            <span className="block text-[12px] text-white/75">{pluralize(totals.itemCount, 'item', 'itens')}</span>
          </span>
          <span className="tabular text-[16px] font-bold">{formatBRL(totals.subtotal)}</span>
          <ChevronRight className="size-5 text-white/80" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export const CART_BAR_SPACE = '66px';
