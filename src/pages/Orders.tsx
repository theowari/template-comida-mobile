import { ChevronRight, ReceiptText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PageHeader } from '../components/layout/Header';
import { ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Notice } from '../components/ui/Notice';
import { formatBRL, formatDateTime, pluralize } from '../lib/format';
import { orderService } from '../services/orders';
import type { Order } from '../types';

type LoadState = { status: 'loading' } | { status: 'ready'; orders: Order[] } | { status: 'error' };

export function Orders() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    orderService
      .listOrders()
      .then((orders) => active && setState({ status: 'ready', orders }))
      .catch(() => active && setState({ status: 'error' }));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader title="Pedidos" />
      <div className="px-4 pt-2 lg:px-0">
        {state.status === 'loading' ? (
          <ul className="space-y-3" aria-label="Carregando pedidos">
            {[0, 1, 2].map((key) => (
              <li key={key} className="h-[104px] animate-pulse rounded-card bg-surface/70 motion-reduce:animate-none" />
            ))}
          </ul>
        ) : state.status === 'error' ? (
          <Notice tone="warning">Não conseguimos carregar seus pedidos. Recarregue a página para tentar de novo.</Notice>
        ) : state.orders.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="Você ainda não fez pedidos"
            actions={<ButtonLink to="/cardapio">Ver cardápio</ButtonLink>}
          >
            Quando você fizer um pedido, ele aparece aqui com o resumo e os valores.
          </EmptyState>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4 lg:mx-0">
            {orderService.isDemo ? (
              <Notice>
                Pedidos de demonstração ficam salvos só neste aparelho. Eles não foram enviados à loja e não têm acompanhamento
                de entrega.
              </Notice>
            ) : null}
            <ul className="space-y-3">
              {state.orders.map((order) => {
                const [first, ...rest] = order.lines;
                const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
                return (
                  <li key={order.id}>
                    <Link
                      to={`/pedido/${order.id}`}
                      className="press flex items-center gap-3 rounded-card bg-surface p-4 shadow-card transition-shadow hover:shadow-[0_14px_30px_-16px_rgb(74_44_26/0.32)]"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                        <ReceiptText className="size-6" strokeWidth={1.8} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-bold">Pedido #{order.id}</span>
                          {order.source === 'demo' ? (
                            <span className="rounded-full bg-ground-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">Demonstração</span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] text-ink-2">
                          {first ? `${first.quantity}x ${first.name}` : ''}
                          {rest.length > 0 ? ` e mais ${pluralize(rest.length, 'item', 'itens')}` : ''}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-ink-2">
                          {formatDateTime(order.createdAt)} · {pluralize(itemCount, 'item', 'itens')} ·{' '}
                          <span className="tabular font-semibold text-ink">{formatBRL(order.totals.total)}</span>
                        </span>
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-ink-2" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
