import type { Address, Cents, CheckoutDraft, CustomerInfo, PaymentChoice } from '../types';
import { formatBRL } from './format';
import { formatCep, isValidCep, isValidPhone } from './masks';

export type StepId = 'dados' | 'entrega' | 'pagamento' | 'revisao';

export const checkoutSteps: { id: StepId; label: string; title: string }[] = [
  { id: 'dados', label: 'Dados', title: 'Como falamos com você?' },
  { id: 'entrega', label: 'Entrega', title: 'Como você quer receber?' },
  { id: 'pagamento', label: 'Pagamento', title: 'Como você vai pagar?' },
  { id: 'revisao', label: 'Revisão', title: 'Confira seu pedido' },
];

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateCustomer(customer: CustomerInfo): FieldErrors<CustomerInfo> {
  const errors: FieldErrors<CustomerInfo> = {};
  if (customer.name.trim().length < 2) errors.name = 'Informe seu nome.';
  if (!isValidPhone(customer.phone)) errors.phone = 'Informe um celular com DDD, como (11) 98765-4321.';
  return errors;
}

export function validateAddress(address: Address): FieldErrors<Address> {
  const errors: FieldErrors<Address> = {};
  if (!isValidCep(address.cep)) errors.cep = 'Informe os 8 números do CEP.';
  if (!address.street.trim()) errors.street = 'Informe a rua.';
  if (!address.number.trim()) errors.number = 'Informe o número. Se não houver, escreva S/N.';
  if (!address.district.trim()) errors.district = 'Informe o bairro.';
  if (!address.city.trim()) errors.city = 'Informe a cidade.';
  if (!address.state) errors.state = 'Escolha o estado.';
  return errors;
}

export function validateDelivery(draft: CheckoutDraft): FieldErrors<Address> {
  return draft.mode === 'entrega' ? validateAddress(draft.address) : {};
}

export function validatePayment(payment: PaymentChoice, total: Cents): FieldErrors<PaymentChoice> {
  const errors: FieldErrors<PaymentChoice> = {};
  if (!payment.method) {
    errors.method = 'Escolha uma forma de pagamento.';
    return errors;
  }
  if (payment.method === 'dinheiro' && payment.needsChange) {
    if (!payment.changeFor) errors.changeFor = 'Informe para quanto você precisa de troco.';
    else if (payment.changeFor <= total) errors.changeFor = `O valor precisa ser maior que o total, ${formatBRL(total)}.`;
  }
  return errors;
}

const isEmpty = (errors: object) => Object.keys(errors).length === 0;

export function stepIsValid(step: StepId, draft: CheckoutDraft, total: Cents): boolean {
  switch (step) {
    case 'dados':
      return isEmpty(validateCustomer(draft.customer));
    case 'entrega':
      return isEmpty(validateDelivery(draft));
    case 'pagamento':
      return isEmpty(validatePayment(draft.payment, total));
    case 'revisao':
      return true;
  }
}

/** First step that still needs input; 'revisao' when everything is filled. */
export function firstIncompleteStep(draft: CheckoutDraft, total: Cents): StepId {
  return checkoutSteps.find((step) => !stepIsValid(step.id, draft, total))?.id ?? 'revisao';
}

export function formatAddress(address: Address): string {
  const line1 = [address.street, address.number].filter(Boolean).join(', ');
  const complement = address.complement ? ` · ${address.complement}` : '';
  const line2 = [address.district, [address.city, address.state].filter(Boolean).join('/')].filter(Boolean).join(', ');
  const cep = address.cep ? ` · CEP ${formatCep(address.cep)}` : '';
  return `${line1}${complement} — ${line2}${cep}`;
}
