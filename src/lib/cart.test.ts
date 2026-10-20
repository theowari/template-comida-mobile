import { describe, expect, it } from 'vitest';
import { cartReducer, emptyCart, MAX_QUANTITY, type CartState } from './cart';

const add = (state: CartState, productId: string, selections = {}, notes = '', quantity = 1) =>
  cartReducer(state, { type: 'add', productId, selections, notes, quantity });

describe('cartReducer', () => {
  it('merges identical items and keeps different choices apart', () => {
    let state = add(emptyCart, 'pizza-suprema', { tamanho: ['media'] });
    state = add(state, 'pizza-suprema', { tamanho: ['media'] });
    state = add(state, 'pizza-suprema', { tamanho: ['grande'] });
    expect(state.items).toHaveLength(2);
    expect(state.items[0].quantity).toBe(2);
  });

  it('treats choice order and note spacing as the same line', () => {
    let state = add(emptyCart, 'pizza-suprema', { adicionais: ['bacon', 'champignon'] }, 'sem orégano');
    state = add(state, 'pizza-suprema', { adicionais: ['champignon', 'bacon'] }, '  Sem orégano ');
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('removes a line when its quantity reaches zero and clamps the maximum', () => {
    let state = add(emptyCart, 'brownie');
    const lineId = state.items[0].lineId;
    state = cartReducer(state, { type: 'set-quantity', lineId, quantity: 99 });
    expect(state.items[0].quantity).toBe(MAX_QUANTITY);
    state = cartReducer(state, { type: 'set-quantity', lineId, quantity: 0 });
    expect(state.items).toHaveLength(0);
  });

  it('restores a removed line at its previous position', () => {
    let state = add(emptyCart, 'brownie');
    state = add(state, 'limonada');
    state = add(state, 'cha-gelado');
    const removed = state.items[1];
    state = cartReducer(state, { type: 'remove', lineId: removed.lineId });
    state = cartReducer(state, { type: 'restore', item: removed, index: 1 });
    expect(state.items.map((item) => item.productId)).toEqual(['brownie', 'limonada', 'cha-gelado']);
  });

  it('merges an edited line into an identical one', () => {
    let state = add(emptyCart, 'pizza-suprema', { tamanho: ['media'] });
    state = add(state, 'pizza-suprema', { tamanho: ['grande'] }, '', 2);
    const [first] = state.items;
    state = cartReducer(state, { type: 'update', lineId: first.lineId, selections: { tamanho: ['grande'] }, notes: '', quantity: 1 });
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('keeps the coupon when the bag is cleared and normalizes its code', () => {
    let state = cartReducer(add(emptyCart, 'brownie'), { type: 'apply-coupon', code: ' bemvindo10 ' });
    state = cartReducer(state, { type: 'clear' });
    expect(state).toEqual({ items: [], couponCode: 'BEMVINDO10' });
  });
});
