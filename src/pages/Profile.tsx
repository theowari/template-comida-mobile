import { ChevronRight, Heart, MapPin, ReceiptText, Tag, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { DemoFootnote } from '../components/home/DemoFootnote';
import { PageHeader } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { store } from '../data/store';
import { useCheckoutDraft } from '../hooks/useCheckoutDraft';
import { useFavorites } from '../hooks/useFavorites';
import { formatAddress } from '../lib/checkout';
import { formatPhone } from '../lib/masks';

export function Profile() {
  const { draft, hasSavedData, forgetSavedData } = useCheckoutDraft();
  const { ids } = useFavorites();
  const [confirming, setConfirming] = useState(false);

  const links = [
    { to: '/favoritos', label: 'Favoritos', icon: Heart, meta: ids.length ? String(ids.length) : undefined },
    { to: '/pedidos', label: 'Meus pedidos', icon: ReceiptText },
    { to: '/ofertas', label: 'Ofertas e cupons', icon: Tag },
  ];

  return (
    <>
      <PageHeader title="Perfil" />
      <div className="mx-auto max-w-2xl space-y-5 px-4 pt-2 lg:mx-0 lg:px-0">
        <section aria-labelledby="dados-titulo" className="rounded-card bg-surface p-4 shadow-card sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
              <UserRound className="size-6" strokeWidth={1.8} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="dados-titulo" className="text-[17px] font-bold">
                {draft.customer.name ? draft.customer.name : 'Peça sem cadastro'}
              </h2>
              <p className="text-[14px] leading-snug text-ink-2">
                {hasSavedData
                  ? 'Seus dados ficam salvos só neste aparelho para agilizar o próximo pedido.'
                  : 'Não é preciso criar conta. Seus dados são salvos neste aparelho quando você faz um pedido.'}
              </p>
            </div>
          </div>

          {hasSavedData ? (
            <dl className="mt-4 space-y-3 border-t border-line pt-4 text-[14px]">
              {draft.customer.phone ? (
                <div>
                  <dt className="text-[13px] text-ink-2">Celular</dt>
                  <dd className="tabular font-medium">{formatPhone(draft.customer.phone)}</dd>
                </div>
              ) : null}
              {draft.address.street ? (
                <div>
                  <dt className="text-[13px] text-ink-2">Endereço salvo</dt>
                  <dd className="flex items-start gap-1.5 font-medium">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-ink-2" aria-hidden />
                    {formatAddress(draft.address)}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {hasSavedData ? (
            confirming ? (
              <div role="alertdialog" aria-labelledby="apagar-titulo" className="mt-4 rounded-xl bg-brand-50 p-3">
                <p id="apagar-titulo" className="text-[14px] font-semibold text-brand-dark">
                  Apagar nome, celular e endereço deste aparelho?
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setConfirming(false)} autoFocus>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      forgetSavedData();
                      setConfirming(false);
                    }}
                  >
                    Apagar dados
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="mt-3 -ml-2" onClick={() => setConfirming(true)}>
                <Trash2 className="size-4" aria-hidden />
                Apagar dados deste aparelho
              </Button>
            )
          ) : null}
        </section>

        <nav aria-label="Atalhos do perfil" className="overflow-hidden rounded-card bg-surface shadow-card">
          <ul className="divide-y divide-line">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <Link to={link.to} className="flex min-h-14 items-center gap-3 px-4 transition-colors hover:bg-ground sm:px-5">
                    <Icon className="size-5 text-ink-2" strokeWidth={1.9} aria-hidden />
                    <span className="flex-1 text-[15px] font-medium">{link.label}</span>
                    {link.meta ? <span className="tabular text-[13px] font-semibold text-ink-2">{link.meta}</span> : null}
                    <ChevronRight className="size-5 text-ink-2" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-labelledby="loja-perfil-titulo" className="rounded-card bg-surface p-4 shadow-card sm:p-5">
          <h2 id="loja-perfil-titulo" className="text-[15px] font-bold">
            {store.name}
          </h2>
          <dl className="mt-2 space-y-1.5 text-[14px]">
            <div className="flex gap-2">
              <dt className="text-ink-2">Horário:</dt>
              <dd>{store.openingHours}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-2">Retirada:</dt>
              <dd>{store.pickup.address}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-2">Telefone:</dt>
              <dd className="tabular">{store.phone}</dd>
            </div>
          </dl>
        </section>

        <DemoFootnote />
      </div>
    </>
  );
}
