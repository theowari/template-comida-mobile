import { describe, expect, it } from 'vitest';
import { store } from '../data/store';
import { getProduct } from '../themes';
import type { CartItem, Product } from '../types';
import {
  computeTotals,
  describeSelections,
  evaluateCoupon,
  hasVariablePrice,
  initialSelections,
  requiresChoice,
  startingPrice,
  unitPrice,
  validateSelections,
} from './pricing';

const product = (id: string) => getProduct(id) as Product;
const item = (productId: string, selections: CartItem['selections'], quantity = 1): CartItem => ({
  lineId: `${productId}-${quantity}`,
  productId,
  selections,
  notes: '',
  quantity,
});

describe('pricing', () => {
  it('starts pizzas at the medium size and marks the price as variable', () => {
    const suprema = product('pizza-suprema');
    expect(startingPrice(suprema)).toBe(4290);
    expect(hasVariablePrice(suprema)).toBe(true);
    expect(requiresChoice(suprema)).toBe(true);
  });

  it('lets products without required choices be added directly', () => {
    expect(requiresChoice(product('pao-de-alho-especial'))).toBe(false);
    expect(requiresChoice(product('brownie'))).toBe(false);
    expect(requiresChoice(product('refrigerante-lata'))).toBe(true);
  });

  it('adds every paid option to the unit price', () => {
    const suprema = product('pizza-suprema');
    const selections = {
      ...initialSelections(suprema),
      tamanho: ['grande'],
      borda: ['catupiry'],
      adicionais: ['bacon', 'cheddar-extra'],
    };
    // 42,90 + 10,00 + 7,00 + 5,00 + 4,00
    expect(unitPrice(suprema, selections)).toBe(6890);
  });

  it('charges the more expensive flavor on half-and-half', () => {
    const margherita = product('pizza-margherita');
    const selections = { ...initialSelections(margherita), tamanho: ['media'], 'meio-a-meio': ['pizza-bbq-especial'] };
    expect(unitPrice(margherita, selections)).toBe(4490);
  });

  it('reports missing required groups and respects the maximum', () => {
    const suprema = product('pizza-suprema');
    const errors = validateSelections(suprema, initialSelections(suprema));
    expect(errors).toEqual({ tamanho: 'Escolha 1 opção' });

    const tooMany = { ...initialSelections(suprema), tamanho: ['media'], adicionais: ['bacon', 'champignon', 'cheddar-extra', 'azeitonas-extra'] };
    expect(validateSelections(suprema, tooMany)).toEqual({ adicionais: 'Escolha no máximo 3' });
  });

  it('describes the configured item in plain language, skipping neutral defaults', () => {
    const suprema = product('pizza-suprema');
    const selections = { ...initialSelections(suprema), tamanho: ['grande'], remover: ['sem-azeitonas'] };
    expect(describeSelections(suprema, selections)).toEqual(['Tamanho grande', 'Massa tradicional', 'Sem azeitonas']);
  });
});

describe('totals and coupons', () => {
  const items = [
    item('pizza-suprema', { ...initialSelections(product('pizza-suprema')), tamanho: ['media'] }, 2),
    item('refrigerante-lata', { sabor: ['guarana'] }, 1),
  ];

  it('separates subtotal, delivery fee and discount', () => {
    const totals = computeTotals(items, getProduct, { mode: 'entrega', couponCode: null });
    expect(totals.subtotal).toBe(2 * 4290 + 690);
    expect(totals.deliveryFee).toBe(store.delivery.fee);
    expect(totals.discount).toBe(0);
    expect(totals.total).toBe(2 * 4290 + 690 + store.delivery.fee);
    expect(totals.itemCount).toBe(3);
  });

  it('has no delivery fee for pickup', () => {
    const totals = computeTotals(items, getProduct, { mode: 'retirada', couponCode: null });
    expect(totals.deliveryFee).toBe(0);
    expect(totals.total).toBe(totals.subtotal);
  });

  it('caps the percent coupon at its maximum discount', () => {
    const big = [item('combo-familia', { sabor: ['pizza-suprema'], refrigerante: ['cola'] }, 3)];
    const totals = computeTotals(big, getProduct, { mode: 'entrega', couponCode: 'BEMVINDO10' });
    expect(totals.discount).toBe(1500);
  });

  it('explains why a coupon does not apply', () => {
    expect(evaluateCoupon('NAOEXISTE', 5000, 699, 'entrega')).toEqual({ state: 'invalid', code: 'NAOEXISTE' });
    expect(evaluateCoupon('BEMVINDO10', 3000, 699, 'entrega')).toMatchObject({ state: 'below-minimum', missing: 1000 });
    expect(evaluateCoupon('FRETEGRATIS', 7000, 0, 'retirada')).toMatchObject({ state: 'not-applicable' });
    expect(evaluateCoupon('fretegratis', 7000, 699, 'entrega')).toMatchObject({ state: 'applied', discount: 699 });
  });

  it('reports how much is missing for the minimum order', () => {
    const small = [item('refrigerante-lata', { sabor: ['cola'] }, 1)];
    const totals = computeTotals(small, getProduct, { mode: 'entrega', couponCode: null });
    expect(totals.missingForMinimum).toBe(store.delivery.minOrder - 690);
  });
});
