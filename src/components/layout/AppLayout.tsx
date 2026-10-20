import { useEffect, type CSSProperties } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { CartDrawer } from '../cart/CartDrawer';
import { FilterSheet } from '../catalog/FilterSheet';
import { ProductDetails } from '../catalog/ProductDetails';
import { BottomNavigation, BOTTOM_NAV_SPACE } from './BottomNavigation';
import { CART_BAR_SPACE, CartBar } from './CartBar';
import { DesktopHeader } from './Header';
import { NavDrawer } from './NavDrawer';
import { NotificationsSheet } from './NotificationsSheet';

/** Root: overlays available on every page (sheets are driven by the URL). */
export function RootLayout() {
  const { pathname } = useLocation();
  const { dismissAll } = useToast();

  // A confirmation belongs to the page where it happened.
  useEffect(() => dismissAll(), [pathname, dismissAll]);

  return (
    <>
      <Outlet />
      <ProductDetails />
      <CartDrawer />
      <FilterSheet />
      <NavDrawer />
      <NotificationsSheet />
      {/* Scroll is remembered per page, like tabs in a native app; sheets never move it. */}
      <ScrollRestoration getKey={(location) => location.pathname} />
    </>
  );
}

/** Store pages: desktop header, bottom navigation and the floating bag bar on phones. */
export function StoreLayout() {
  const { totals } = useCart();
  const bottomSpace = totals.itemCount > 0 ? `calc(${BOTTOM_NAV_SPACE} + ${CART_BAR_SPACE})` : BOTTOM_NAV_SPACE;

  return (
    <div className="min-h-dvh">
      <a
        href="#conteudo"
        className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <DesktopHeader />
      <main
        id="conteudo"
        className="mx-auto max-w-[1240px] pb-[var(--bottom-space)] lg:px-8 lg:pb-16"
        style={{ '--bottom-space': bottomSpace } as CSSProperties}
      >
        <Outlet />
      </main>
      <CartBar />
      <BottomNavigation />
    </div>
  );
}
