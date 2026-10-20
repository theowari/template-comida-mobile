import { Bike, Clock, Info, Phone, Store } from 'lucide-react';
import { NavLink } from 'react-router';
import { store } from '../../data/store';
import { useFavorites } from '../../hooks/useFavorites';
import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/cn';
import { formatBRL } from '../../lib/format';
import { Logo } from '../ui/Logo';
import { CloseButton, Sheet } from '../ui/Sheet';
import { drawerNav } from './navigation';

export function NavDrawer() {
  const overlay = useOverlay('menu');
  const { ids } = useFavorites();
  const { theme } = useTheme();

  return (
    <Sheet open={overlay.isOpen} onClose={overlay.close} labelledBy="menu-titulo" variant="left">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3">
        <h2 id="menu-titulo" className="sr-only">
          Menu
        </h2>
        <Logo />
        <CloseButton onClick={overlay.close} label="Fechar menu" />
      </div>
      <div className="sheet-body px-3 py-3">
        <nav aria-label="Menu">
          <ul className="space-y-0.5">
            {drawerNav.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    replace
                    className={({ isActive }) =>
                      cn(
                        'flex h-12 items-center gap-3 rounded-xl px-3 text-[15px] transition-colors',
                        isActive ? 'bg-brand-50 font-bold text-brand-dark' : 'font-medium text-ink hover:bg-ground-2',
                      )
                    }
                  >
                    <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                    <span className="flex-1">{item.label}</span>
                    {item.to === '/favoritos' && ids.length > 0 ? (
                      <span className="tabular text-[13px] font-semibold text-ink-2">{ids.length}</span>
                    ) : null}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-labelledby="loja-titulo" className="mt-5 rounded-2xl bg-ground px-4 py-4">
          <h3 id="loja-titulo" className="flex items-center gap-2 text-[15px] font-bold">
            <Store className="size-[18px] text-brand" aria-hidden />
            Sobre a loja
          </h3>
          <dl className="mt-3 space-y-2.5 text-[14px]">
            <div className="flex gap-2.5">
              <Bike className="mt-0.5 size-4 shrink-0 text-ink-2" aria-hidden />
              <div>
                <dt className="sr-only">Entrega</dt>
                <dd>
                  Entrega em {store.delivery.estimate} · taxa {formatBRL(store.delivery.fee)}
                  <span className="block text-[13px] text-ink-2">Pedido mínimo {formatBRL(store.delivery.minOrder)}</span>
                </dd>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-ink-2" aria-hidden />
              <div>
                <dt className="sr-only">Horário</dt>
                <dd>{theme.brand.openingHours}</dd>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-ink-2" aria-hidden />
              <div>
                <dt className="sr-only">Telefone</dt>
                <dd className="tabular">{store.phone}</dd>
              </div>
            </div>
          </dl>
        </section>

        {store.demoMode ? (
          <p className="mt-4 flex items-start gap-2 px-1 text-[13px] leading-snug text-ink-2">
            <Info className="mt-px size-4 shrink-0" aria-hidden />
            Loja de demonstração: horários, contato, preços e promoções são fictícios.
          </p>
        ) : null}
      </div>
    </Sheet>
  );
}
