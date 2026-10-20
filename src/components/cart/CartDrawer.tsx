import { Plus, ShoppingBag, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { store } from '../../data/store';
import { useCart } from '../../hooks/useCart';
import { useCheckoutDraft } from '../../hooks/useCheckoutDraft';
import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';
import { formatBRL, pluralize } from '../../lib/format';
import { getProduct } from '../../themes';
import type { CartItem } from '../../types';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Notice } from '../ui/Notice';
import { Sheet, SheetFooter, SheetHeader } from '../ui/Sheet';
import { CartItemRow } from './CartItemRow';
import { CouponField } from './CouponField';
import { OrderSummary } from './OrderSummary';

interface Removed {
  item: CartItem;
  index: number;
}

export function CartDrawer() {
  const overlay = useOverlay('sacola');
  const cart = useCart();
  const { draft } = useCheckoutDraft();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [removed, setRemoved] = useState<Removed | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const { totals } = cart;
  const empty = cart.items.length === 0;

  // The undo offer expires after a few seconds and when the sheet closes.
  useEffect(() => {
    if (!removed) return;
    const timeout = window.setTimeout(() => setRemoved(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [removed]);

  useEffect(() => {
    if (!overlay.isOpen) {
      setRemoved(null);
      setConfirmClear(false);
    }
  }, [overlay.isOpen]);

  const removeLine = (lineId: string) => {
    const result = cart.remove(lineId);
    if (result) setRemoved(result);
  };

  const removedProduct = removed ? getProduct(removed.item.productId) : undefined;
  const belowMinimum = totals.missingForMinimum > 0;

  return (
    <Sheet open={overlay.isOpen} onClose={overlay.close} labelledBy="sacola-titulo" variant="right" size="full">
      <SheetHeader
        titleId="sacola-titulo"
        title="Sua sacola"
        subtitle={empty ? undefined : pluralize(totals.itemCount, 'item', 'itens')}
        onClose={overlay.close}
        actions={
          !empty && !confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="h-11 rounded-full px-3 text-sm font-semibold text-brand-dark hover:bg-brand-50"
            >
              Limpar
            </button>
          ) : null
        }
      />

      {confirmClear ? (
        <div role="alertdialog" aria-labelledby="limpar-titulo" className="flex items-center gap-2 border-b border-line bg-brand-50 px-4 py-3 sm:px-5">
          <p id="limpar-titulo" className="min-w-0 flex-1 text-[14px] font-semibold text-brand-dark">
            Tirar todos os itens da sacola?
          </p>
          <Button size="sm" variant="secondary" onClick={() => setConfirmClear(false)} autoFocus>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              cart.clear();
              setConfirmClear(false);
              setRemoved(null);
            }}
          >
            Limpar
          </Button>
        </div>
      ) : null}

      <div className="sheet-body">
        {empty && !removed ? (
          <EmptyState
            icon={ShoppingBag}
            title="Sua sacola está vazia"
            className="pt-16"
            actions={
              <Button onClick={() => navigate('/cardapio', { replace: true })}>
                Ver cardápio
              </Button>
            }
          >
            Escolha algo gostoso no cardápio e ele aparece aqui.
          </EmptyState>
        ) : (
          <div className="px-4 sm:px-5">
            <p className="flex items-center gap-2 pt-4 text-[13px] text-ink-2">
              <Store className="size-4" aria-hidden />
              {theme.brand.name.join(' ')} · {draft.mode === 'retirada' ? `Retirada em ${store.pickup.estimate}` : `Entrega em ${store.delivery.estimate}`}
            </p>

            <ul className="divide-y divide-line">
              {cart.items.map((item) => (
                <li key={item.lineId}>
                  <CartItemRow
                    item={item}
                    onQuantity={(quantity) => cart.setQuantity(item.lineId, quantity)}
                    onRemove={() => removeLine(item.lineId)}
                  />
                </li>
              ))}
            </ul>

            {removed && removedProduct ? (
              <div role="status" className="mb-2 flex items-center gap-3 rounded-xl bg-ground-2 px-3.5 py-2.5 text-[14px]">
                <p className="min-w-0 flex-1">
                  <span className="font-semibold">{removedProduct.name}</span> saiu da sacola.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    cart.restore(removed.item, removed.index);
                    setRemoved(null);
                  }}
                >
                  Desfazer
                </Button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={overlay.close}
              className="-ml-2 inline-flex h-11 items-center gap-1.5 rounded-full px-2 text-[15px] font-semibold text-brand-dark hover:bg-brand-50"
            >
              <Plus className="size-[18px]" strokeWidth={2.5} aria-hidden />
              Adicionar mais itens
            </button>

            {!empty ? (
              <>
                <div className="mt-4 border-t border-line pt-5">
                  <CouponField />
                </div>
                <div className="mt-6 border-t border-line pt-5 pb-6">
                  <h3 className="mb-3 text-[15px] font-bold">Resumo de valores</h3>
                  <OrderSummary
                    totals={totals}
                    mode={draft.mode}
                    feeNote={draft.mode === 'entrega' ? 'Retirada na loja não tem taxa' : undefined}
                  />
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      {!empty ? (
        <SheetFooter>
          {belowMinimum ? (
            <Notice tone="warning" className="mb-3">
              Faltam {formatBRL(totals.missingForMinimum)} para o pedido mínimo de {formatBRL(store.delivery.minOrder)}.
            </Notice>
          ) : null}
          <div className="flex items-center gap-3">
            <div className="shrink-0 leading-tight">
              <p className="text-[12px] text-ink-2">Total</p>
              <p className="tabular text-[18px] font-bold">{formatBRL(totals.total)}</p>
            </div>
            <Button size="lg" className="flex-1" disabled={belowMinimum} onClick={() => navigate('/checkout')}>
              Continuar
            </Button>
          </div>
        </SheetFooter>
      ) : null}
    </Sheet>
  );
}
