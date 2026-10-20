import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from '../../hooks/useCart';
import { CheckoutDraftProvider } from '../../hooks/useCheckoutDraft';
import { ThemeProvider, useTheme } from '../../hooks/useTheme';
import { initialSelections, requiresChoice } from '../../lib/pricing';
import { Logo } from '../ui/Logo';
import { ThemeBar } from './ThemeBar';

/** Adds the first product of the current theme that needs no choice, and shows the bag count. */
function BagProbe() {
  const { theme } = useTheme();
  const { add, totals } = useCart();
  const product = theme.catalog.products.find((candidate) => !requiresChoice(candidate))!;
  return (
    <>
      <button type="button" onClick={() => add(product.id, initialSelections(product), '', 1)}>
        Adicionar teste
      </button>
      <output data-testid="bag">{totals.itemCount}</output>
    </>
  );
}

function renderStore() {
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <>
          <ThemeBar />
          <Logo />
          <BagProbe />
        </>
      ),
    },
  ]);
  return render(
    <ThemeProvider>
      <CheckoutDraftProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </CheckoutDraftProvider>
    </ThemeProvider>,
  );
}

const html = document.documentElement;

describe('ThemeBar', () => {
  beforeEach(() => {
    localStorage.clear();
    delete html.dataset.theme;
  });

  it('starts on Pizzaria and switches the whole brand from the list', async () => {
    renderStore();
    const combobox = screen.getByRole('combobox', { name: 'Ver este site como' });
    expect(combobox).toHaveTextContent('Pizzaria');
    expect(html.dataset.theme).toBe('pizzaria');
    expect(screen.getByText('negócio')).toBeInTheDocument();

    await userEvent.click(combobox);
    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual([
      'PizzariaSeu negócio',
      'ConfeitariaAteliê Doce',
      'CafeteriaGrão & Prosa',
      'AçaíteriaRoxo Açaí',
    ]);
    expect(screen.getByRole('option', { name: /Pizzaria/ })).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(screen.getByRole('option', { name: /Cafeteria/ }));
    await waitFor(() => expect(html.dataset.theme).toBe('cafeteria'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('& Prosa')).toBeInTheDocument();
    expect(document.title).toBe('Grão & Prosa · Cafés especiais e delivery');
    expect(screen.getByText('Site exibido como Cafeteria: Grão & Prosa.')).toBeInTheDocument();
  });

  it('works from the keyboard and Esc leaves the theme as it was', async () => {
    renderStore();
    const combobox = screen.getByRole('combobox');
    combobox.focus();

    await userEvent.keyboard('{ArrowDown}');
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{End}');
    expect(combobox.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: /Açaíteria/ }).id);
    await userEvent.keyboard('{Escape}');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(html.dataset.theme).toBe('pizzaria');

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await waitFor(() => expect(html.dataset.theme).toBe('confeitaria'));
    expect(combobox).toHaveFocus();
    expect(screen.getByText('Doce')).toBeInTheDocument();
  });

  it('keeps one bag per theme', async () => {
    renderStore();
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar teste' }));
    expect(screen.getByTestId('bag')).toHaveTextContent('1');

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Açaíteria/ }));
    await waitFor(() => expect(html.dataset.theme).toBe('acaiteria'));
    expect(screen.getByTestId('bag')).toHaveTextContent('0');

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Pizzaria/ }));
    await waitFor(() => expect(html.dataset.theme).toBe('pizzaria'));
    expect(screen.getByTestId('bag')).toHaveTextContent('1');
  });
});
