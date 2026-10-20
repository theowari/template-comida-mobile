import { describe, expect, it } from 'vitest';
import { emptyDraft } from '../hooks/useCheckoutDraft';
import type { CheckoutDraft } from '../types';
import { firstIncompleteStep, validateAddress, validateCustomer, validatePayment } from './checkout';
import { formatBRL } from './format';
import { formatCep, formatPhone, isValidPhone, parseMoneyInput } from './masks';

const complete: CheckoutDraft = {
  customer: { name: 'Maria Souza', phone: '11987654321' },
  mode: 'entrega',
  address: {
    cep: '01310100',
    street: 'Avenida Paulista',
    number: '1000',
    complement: '',
    district: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    reference: '',
  },
  payment: { method: 'pix', needsChange: false, changeFor: null },
};

describe('masks and formatting', () => {
  it('formats Brazilian currency', () => {
    expect(formatBRL(4290)).toBe('R$ 42,90');
    expect(formatBRL(123456)).toBe('R$ 1.234,56');
  });

  it('formats phones and CEP while typing', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    expect(formatPhone('119')).toBe('(11) 9');
    expect(formatCep('01310100')).toBe('01310-100');
    expect(isValidPhone('(11) 98765-4321')).toBe(true);
    expect(isValidPhone('(11) 8765-432')).toBe(false);
  });

  it('parses money typed with a comma', () => {
    expect(parseMoneyInput('50')).toBe(5000);
    expect(parseMoneyInput('50,5')).toBe(5050);
    expect(parseMoneyInput('1.234,56')).toBe(123456);
    expect(parseMoneyInput('')).toBeNull();
  });
});

describe('checkout validation', () => {
  it('asks only for what is missing', () => {
    expect(validateCustomer({ name: '', phone: '119' })).toEqual({
      name: 'Informe seu nome.',
      phone: 'Informe um celular com DDD, como (11) 98765-4321.',
    });
    expect(Object.keys(validateAddress({ ...complete.address, complement: '', reference: '' }))).toEqual([]);
    expect(validateAddress({ ...complete.address, number: ' ' }).number).toMatch(/S\/N/);
  });

  it('requires change to be more than the total', () => {
    const cash = { method: 'dinheiro' as const, needsChange: true, changeFor: 5000 };
    expect(validatePayment(cash, 6000).changeFor).toContain('maior que o total');
    expect(validatePayment({ ...cash, changeFor: 10000 }, 6000)).toEqual({});
    expect(validatePayment({ method: null, needsChange: false, changeFor: null }, 6000).method).toBeDefined();
  });

  it('skips the address for pickup and finds the first incomplete step', () => {
    expect(firstIncompleteStep(emptyDraft, 5000)).toBe('dados');
    expect(firstIncompleteStep({ ...complete, payment: emptyDraft.payment }, 5000)).toBe('pagamento');
    expect(firstIncompleteStep({ ...complete, mode: 'retirada', address: emptyDraft.address }, 5000)).toBe('revisao');
    expect(firstIncompleteStep({ ...complete, address: { ...complete.address, cep: '' } }, 5000)).toBe('entrega');
  });
});
