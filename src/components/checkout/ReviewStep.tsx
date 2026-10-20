import { Pencil } from 'lucide-react';
import type { ReactNode } from 'react';
import { getProduct } from '../../data/products';
import { store } from '../../data/store';
import { useCart } from '../../hooks/useCart';
import { useCheckoutDraft } from '../../hooks/useCheckoutDraft';
import { useOverlay } from '../../hooks/useOverlay';
import { formatAddress, type StepId } from '../../lib/checkout';
import { formatBRL } from '../../lib/format';
import { formatPhone } from '../../lib/masks';
import { describeSelections, lineTotal } from '../../lib/pricing';
import { OrderSummary } from '../cart/OrderSummary';
import { paymentLabel } from './PaymentStep';

interface ReviewStepProps {
  onEdit: (step: StepId) => void;
}

export function ReviewStep({ onEdit }: ReviewStepProps) {
  const cart = useCart();
  const { draft } = useCheckoutDraft();
  const bag = useOverlay('sacola');
  const { payment } = draft;

  return (
    <div className="space-y-4">
      <ReviewCard
        title={`Itens (${cart.totals.itemCount})`}
        actionLabel="Editar itens"
        onAction={() => bag.open()}
      >
        <ul className="divide-y divide-line">
          {cart.items.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            const details = describeSelections(product, item.selections);
            return (
              <li key={item.lineId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <span className="tabular w-7 shrink-0 font-semibold text-ink-2">{item.quantity}x</span>
                <div className="min-w-0 flex-1 text-[14px]">
                  <p className="font-semibold">{product.name}</p>
                  {details.length > 0 ? <p className="text-[13px] leading-snug text-ink-2">{details.join(' · ')}</p> : null}
                  {item.notes ? <p className="text-[13px] leading-snug text-ink-2 italic">Obs.: {item.notes}</p> : null}
                </div>
                <span className="tabular shrink-0 text-[14px] font-semibold">{formatBRL(lineTotal(product, item))}</span>
              </li>
            );
          })}
        </ul>
      </ReviewCard>

      <ReviewCard title="Seus dados" actionLabel="Alterar" onAction={() => onEdit('dados')}>
        <p className="text-[15px] font-medium">{draft.customer.name}</p>
        <p className="tabular text-[14px] text-ink-2">{formatPhone(draft.customer.phone)}</p>
      </ReviewCard>

      <ReviewCard title={draft.mode === 'entrega' ? 'Entrega' : 'Retirada na loja'} actionLabel="Alterar" onAction={() => onEdit('entrega')}>
        {draft.mode === 'entrega' ? (
          <>
            <p className="text-[15px] leading-snug font-medium">{formatAddress(draft.address)}</p>
            {draft.address.reference ? <p className="text-[14px] text-ink-2">Referência: {draft.address.reference}</p> : null}
            <p className="mt-1 text-[14px] text-ink-2">Estimativa: {store.delivery.estimate}</p>
          </>
        ) : (
          <>
            <p className="text-[15px] font-medium">{store.pickup.address}</p>
            <p className="mt-1 text-[14px] text-ink-2">Pronto em cerca de {store.pickup.estimate}</p>
          </>
        )}
      </ReviewCard>

      <ReviewCard title="Pagamento" actionLabel="Alterar" onAction={() => onEdit('pagamento')}>
        <p className="text-[15px] font-medium">{paymentLabel(payment.method, draft.mode)}</p>
        {payment.method === 'dinheiro' ? (
          <p className="text-[14px] text-ink-2">
            {payment.needsChange && payment.changeFor ? `Troco para ${formatBRL(payment.changeFor)}` : 'Sem troco'}
          </p>
        ) : null}
        {payment.method === 'pix' ? <p className="text-[14px] text-ink-2">O código Pix aparece após a confirmação.</p> : null}
      </ReviewCard>

      <section aria-labelledby="valores-titulo" className="rounded-card bg-surface p-4 shadow-card sm:p-5">
        <h3 id="valores-titulo" className="mb-3 text-[15px] font-bold">
          Valores
        </h3>
        <OrderSummary totals={cart.totals} mode={draft.mode} />
      </section>
    </div>
  );
}

interface ReviewCardProps {
  title: string;
  actionLabel: string;
  onAction: () => void;
  children: ReactNode;
}

function ReviewCard({ title, actionLabel, onAction, children }: ReviewCardProps) {
  return (
    <section aria-label={title} className="rounded-card bg-surface p-4 shadow-card sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold">{title}</h3>
        <button
          type="button"
          onClick={onAction}
          className="-mr-2 inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[14px] font-semibold text-brand-dark hover:bg-brand-50"
        >
          <Pencil className="size-4" aria-hidden />
          {actionLabel}
          <span className="sr-only">: {title}</span>
        </button>
      </div>
      {children}
    </section>
  );
}
