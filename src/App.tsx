import { createBrowserRouter, RouterProvider } from 'react-router';
import { RootLayout, StoreLayout } from './components/layout/AppLayout';
import { CartProvider } from './hooks/useCart';
import { CatalogFiltersProvider } from './hooks/useCatalogFilters';
import { CheckoutDraftProvider } from './hooks/useCheckoutDraft';
import { FavoritesProvider } from './hooks/useFavorites';
import { ToastProvider } from './hooks/useToast';
import { Checkout } from './pages/Checkout';
import { Favorites } from './pages/Favorites';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { NotFound } from './pages/NotFound';
import { Offers } from './pages/Offers';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <StoreLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'cardapio', element: <Menu /> },
          { path: 'pedidos', element: <Orders /> },
          { path: 'pedido/:id', element: <OrderConfirmation /> },
          { path: 'ofertas', element: <Offers /> },
          { path: 'perfil', element: <Profile /> },
          { path: 'favoritos', element: <Favorites /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      { path: 'checkout', element: <Checkout /> },
    ],
  },
]);

export function App() {
  return (
    <CheckoutDraftProvider>
      <CartProvider>
        <FavoritesProvider>
          <CatalogFiltersProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </CatalogFiltersProvider>
        </FavoritesProvider>
      </CartProvider>
    </CheckoutDraftProvider>
  );
}
