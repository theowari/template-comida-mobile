import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { getProduct } from '../../themes';
import { CartProvider, useCart } from '../../hooks/useCart';
import { CheckoutDraftProvider } from '../../hooks/useCheckoutDraft';
import { FavoritesProvider } from '../../hooks/useFavorites';
import { ThemeProvider } from '../../hooks/useTheme';
import { ToastProvider } from '../../hooks/useToast';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

function Probe() {
  const { totals } = useCart();
  const location = useLocation();
  return (
    <output data-testid="probe">
      {totals.itemCount}|{location.search}
    </output>
  );
}

function renderCard(product: Product) {
  const Providers = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>
      <CheckoutDraftProvider>
        <CartProvider>
          <FavoritesProvider>
            <ToastProvider>{children}</ToastProvider>
          </FavoritesProvider>
        </CartProvider>
      </CheckoutDraftProvider>
    </ThemeProvider>
  );
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <>
          <ProductCard product={product} />
          <Probe />
        </>
      ),
    },
  ]);
  return render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>,
  );
}

describe('ProductCard', () => {
  beforeEach(() => localStorage.clear());

  it('adds a product without required choices straight to the bag and confirms it', async () => {
    renderCard(getProduct('pao-de-alho-especial') as Product);
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar Pão de Alho Especial à sacola' }));
    expect(screen.getByTestId('probe')).toHaveTextContent('1|');
    expect(screen.getByText('Adicionado à sacola: Pão de Alho Especial')).toBeInTheDocument();
  });

  it('opens the options first when a choice is required', async () => {
    renderCard(getProduct('pizza-suprema') as Product);
    await userEvent.click(screen.getByRole('button', { name: 'Escolher opções de Pizza Suprema' }));
    expect(screen.getByTestId('probe')).toHaveTextContent('0|?produto=pizza-suprema');
  });

  it('shows the starting price, demo rating and a pressed favorite state', async () => {
    renderCard(getProduct('pizza-suprema') as Product);
    const card = screen.getByRole('article');
    expect(within(card).getByText('a partir de')).toBeInTheDocument();
    expect(within(card).getByText(/^R\$\s42,90$/)).toBeInTheDocument();
    expect(within(card).getByText(/Avaliação demonstrativa/)).toBeInTheDocument();

    const heart = within(card).getByRole('button', { name: 'Favoritar Pizza Suprema' });
    expect(heart).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(heart);
    expect(heart).toHaveAttribute('aria-pressed', 'true');
  });
});
