import { CircleCheck, MapPin, ReceiptText, SearchX, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { OrderSummary } from '../components/cart/OrderSummary';
import { paymentLabel } from '../components/checkout/PaymentStep';
import { ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Notice } from '../components/ui/Notice';
import { store } from '../data/store';
import { formatAddress } from '../lib/checkout';
import { formatBRL, formatDateTime } from '../lib/format';
import { orderService } from '../services/orders';
import type { Order, OrderStatus } from '../types';

type LoadState = { status: 'loading' } | { status: 'ready'; order: Order | null };

export function OrderConfirmation() {
  const { id = '' } = useParams();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    orderService
      .getOrder(id)
      .then((order) => active && setState({ status: 'ready', order }))
      .catch(() => active && setState({ status: 'ready', order: null }));
    return () => {
      active = false;
    };
  }, [id]);

  if (state.status === 'loading') {
    return <div className="mx-4 mt-8 h-64 animate-pulse rounded-card bg-surface/70 motion-reduce:animate-none lg:mx-0" aria-label="Carregando pedido" />;
  }

  const { order } = state;
  if (!order) {
    return (
      <div className="pt-12">
        <h1 className="sr-only">Pedido não encontrado</h1>
        <EmptyState icon={SearchX} title="Pedido não encontrado" actions={<ButtonLink to="/pedidos">Ver meus pedidos</ButtonLink>}>
          Pedidos de demonstração ficam salvos só no aparelho em que foram feitos.
        </EmptyState>
      </div>
    );
  }

  const isDemo = order.source === 'demo';

  return (
    <div className="mx-auto max-w-2xl px-4 pt-[max(24px,env(safe-area-inset-top))] lg:px-0 lg:pt-10">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-success-50 text-success">
          <CircleCheck className="size-8" strokeWidth={1.8} aria-hidden />
        </span>
        <h1 className="mt-4 text-[24px] leading-tight font-bold tracking-[-0.02em] lg:text-[30px]">
          {isDemo ? 'Pedido de demonstração registrado' : 'Pedido enviado à loja'}
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-2">
          Pedido <span className="tabular font-semibold text-ink">#{order.id}</span> · {formatDateTime(order.createdAt)}
        </p>
      </div>

      {isDemo ? (
        <Notice tone="warning" className="mt-5">
          Este pedido <strong className="font-semibold">não foi enviado ao estabelecimento</strong> e nenhuma cobrança foi feita.
          Quando a loja estiver conectada a um sistema de pedidos, o status aparece aqui.
        </Notice>
      ) : order.status ? (
        <OrderStatusSteps status={order.status} mode={order.mode} />
      ) : null}

      <section aria-labelledby="resumo-titulo" className="mt-5 rounded-card bg-surface p-4 shadow-card sm:p-5">
        <h2 id="resumo-titulo" className="text-[17px] font-bold">
          Resumo
        </h2>
        <ul className="mt-3 divide-y divide-line">
          {order.lines.map((line, index) => (
            <li key={`${line.productId}-${index}`} className="flex gap-3 py-3 text-[14px] first:pt-0">
              <span className="tabular w-7 shrink-0 font-semibold text-ink-2">{line.quantity}x</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{line.name}</p>
                {line.details.length > 0 ? <p className="text-[13px] leading-snug text-ink-2">{line.details.join(' · ')}</p> : null}
                {line.notes ? <p className="text-[13px] text-ink-2 italic">Obs.: {line.notes}</p> : null}
              </div>
              <span className="tabular shrink-0 font-semibold">{formatBRL(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary totals={{ ...order.totals, coupon: { state: 'none' } }} mode={order.mode} className="mt-4 border-t border-line pt-4" />
        {order.couponCode ? <p className="mt-2 text-[13px] text-ink-2">Cupom usado: {order.couponCode}</p> : null}
      </section>

      <section aria-label="Entrega e pagamento" className="mt-4 space-y-3 rounded-card bg-surface p-4 text-[14px] shadow-card sm:p-5">
        <p className="flex items-start gap-2.5">
          {order.mode === 'entrega' ? (
            <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          ) : (
            <Store className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          )}
          <span>
            <span className="block font-semibold">{order.mode === 'entrega' ? 'Entrega' : 'Retirada na loja'}</span>
            <span className="block text-ink-2">
              {order.mode === 'entrega' && order.address ? formatAddress(order.address) : store.pickup.address}
            </span>
          </span>
        </p>
        <p className="flex items-start gap-2.5">
          <ReceiptText className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <span>
            <span className="block font-semibold">{paymentLabel(order.payment.method, order.mode)}</span>
            {order.payment.method === 'dinheiro' && order.payment.needsChange && order.payment.changeFor ? (
              <span className="block text-ink-2">Troco para {formatBRL(order.payment.changeFor)}</span>
            ) : null}
          </span>
        </p>
      </section>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <ButtonLink to="/" size="lg" className="flex-1">
          Voltar ao início
        </ButtonLink>
        <ButtonLink to="/pedidos" variant="secondary" size="lg" className="flex-1">
          Ver meus pedidos
        </ButtonLink>
      </div>
    </div>
  );
}

const statusFlow: Record<'entrega' | 'retirada', { id: OrderStatus; label: string }[]> = {
  entrega: [
    { id: 'recebido', label: 'Pedido recebido' },
    { id: 'em-preparo', label: 'Em preparo' },
    { id: 'a-caminho', label: 'Saiu para entrega' },
    { id: 'entregue', label: 'Entregue' },
  ],
  retirada: [
    { id: 'recebido', label: 'Pedido recebido' },
    { id: 'em-preparo', label: 'Em preparo' },
    { id: 'pronto-para-retirada', label: 'Pronto para retirada' },
    { id: 'entregue', label: 'Retirado' },
  ],
};

/** Real status from the backend. Never rendered for demo orders. */
function OrderStatusSteps({ status, mode }: { status: OrderStatus; mode: 'entrega' | 'retirada' }) {
  if (status === 'cancelado') {
    return <Notice tone="warning" className="mt-5">Este pedido foi cancelado pela loja.</Notice>;
  }
  const flow = statusFlow[mode];
  const current = flow.findIndex((item) => item.id === status);
  return (
    <ol aria-label="Status do pedido" className="mt-5 space-y-2 rounded-card bg-surface p-4 shadow-card">
      {flow.map((item, index) => (
        <li key={item.id} aria-current={index === current ? 'step' : undefined} className="flex items-center gap-3 text-[14px]">
          <span className={`size-3 rounded-full ${index <= current ? 'bg-success' : 'bg-line-strong'}`} aria-hidden />
          <span className={index === current ? 'font-bold' : index < current ? '' : 'text-ink-2'}>{item.label}</span>
        </li>
      ))}
    </ol>
  );
}
