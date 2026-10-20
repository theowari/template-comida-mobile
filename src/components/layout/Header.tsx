import { Bell, Heart, Menu, Pizza, ShoppingBag } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { notifications, store } from '../../data/store';
import { useCart } from '../../hooks/useCart';
import { useOverlay } from '../../hooks/useOverlay';
import { cn } from '../../lib/cn';
import { formatBRL, pluralize } from '../../lib/format';
import { SearchBar } from '../catalog/SearchBar';
import { CountBadge, IconTile } from '../ui/IconTile';
import { Logo } from '../ui/Logo';
import { primaryNav } from './navigation';

function useHeaderActions() {
  const menu = useOverlay('menu');
  const bag = useOverlay('sacola');
  const alerts = useOverlay('avisos');
  const { totals } = useCart();
  const unread = notifications.filter((notification) => !notification.read).length;
  const bagLabel = totals.itemCount > 0 ? `Sacola, ${pluralize(totals.itemCount, 'item', 'itens')}` : 'Sacola, vazia';
  return { menu, bag, alerts, totals, unread, bagLabel };
}

/** Phone header of the home page: menu, greeting + logo + tagline, notifications, bag. */
export function HomeHeader() {
  const { menu, bag, alerts, totals, unread, bagLabel } = useHeaderActions();
  return (
    <header className="pt-safe lg:hidden">
      <div className="flex items-center gap-3 px-4 pt-3 pb-1">
        <IconTile icon={Menu} label="Abrir menu" onClick={() => menu.open()} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[12px] leading-none font-medium text-ink-2">
            {store.greeting}
            <Pizza className="size-3.5 text-brand" strokeWidth={2.25} aria-hidden />
          </p>
          <Link to="/" aria-label={`${store.name}, início`} className="mt-1 inline-flex rounded-md">
            <Logo />
          </Link>
          <p className="mt-0.5 truncate text-[12px] leading-none text-ink-2">{store.tagline}</p>
        </div>
        <IconTile
          icon={Bell}
          label={unread ? `Notificações, ${unread} novas` : 'Notificações'}
          badge={unread}
          onClick={() => alerts.open()}
        />
        <IconTile icon={ShoppingBag} label={bagLabel} badge={totals.itemCount} onClick={() => bag.open()} />
      </div>
    </header>
  );
}

/** Phone header for the other tabs: menu, page title, bag. */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  const { menu, bag, totals, bagLabel } = useHeaderActions();
  return (
    <header className="pt-safe">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 lg:px-0 lg:pt-8">
        <IconTile icon={Menu} label="Abrir menu" onClick={() => menu.open()} className="lg:hidden" />
        <h1 className="min-w-0 flex-1 truncate text-[22px] font-bold tracking-[-0.02em] lg:text-[32px]">{title}</h1>
        {children}
        <IconTile icon={ShoppingBag} label={bagLabel} badge={totals.itemCount} onClick={() => bag.open()} className="lg:hidden" />
      </div>
    </header>
  );
}

/** Desktop header: logo, navigation, search, favorites, notifications, bag with total. */
export function DesktopHeader() {
  const { bag, alerts, totals, unread, bagLabel } = useHeaderActions();
  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-ground/95 lg:block">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center gap-5 px-8">
        <Link to="/" aria-label={`${store.name}, início`} className="shrink-0 rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Principal">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex h-10 items-center rounded-full px-3.5 text-[15px] font-medium transition-colors',
                      isActive ? 'bg-brand-50 font-semibold text-brand-dark' : 'text-ink hover:bg-ground-2',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <SearchBar compact className="ml-auto min-w-0 flex-1 basis-[260px] xl:max-w-[400px]" />
        <div className="flex items-center gap-2.5">
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="press grid size-11 place-items-center rounded-tile bg-surface text-ink shadow-tile"
          >
            <Heart className="size-[22px]" strokeWidth={1.8} aria-hidden />
          </Link>
          <IconTile
            icon={Bell}
            label={unread ? `Notificações, ${unread} novas` : 'Notificações'}
            badge={unread}
            onClick={() => alerts.open()}
          />
          <button
            type="button"
            onClick={() => bag.open()}
            aria-label={bagLabel}
            className="press relative inline-flex h-11 items-center gap-2 rounded-full bg-brand pr-4 pl-3.5 font-semibold text-white shadow-[0_8px_18px_-10px_rgb(184_16_43/0.8)] transition-colors hover:bg-brand-dark"
          >
            <ShoppingBag className="size-5" strokeWidth={2} aria-hidden />
            <span className="tabular">{totals.itemCount > 0 ? formatBRL(totals.subtotal) : 'Sacola'}</span>
            {totals.itemCount > 0 ? <CountBadge count={totals.itemCount} className="absolute -top-1.5 -right-1.5" /> : null}
          </button>
        </div>
      </div>
    </header>
  );
}
