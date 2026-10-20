import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStorage, removeStorage, storageKeys, writeStorage } from '../lib/storage';
import type { Address, CheckoutDraft, CustomerInfo, FulfillmentMode, PaymentChoice } from '../types';

export const emptyAddress: Address = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  reference: '',
};

export const emptyDraft: CheckoutDraft = {
  customer: { name: '', phone: '' },
  mode: 'entrega',
  address: emptyAddress,
  payment: { method: null, needsChange: false, changeFor: null },
};

const isDraft = (value: unknown): value is CheckoutDraft =>
  typeof value === 'object' && value !== null && 'customer' in value && 'address' in value;

interface CheckoutDraftContextValue {
  draft: CheckoutDraft;
  setCustomer: (patch: Partial<CustomerInfo>) => void;
  setMode: (mode: FulfillmentMode) => void;
  setAddress: (patch: Partial<Address>) => void;
  setPayment: (patch: Partial<PaymentChoice>) => void;
  /** Saved contact and address exist on this device. */
  hasSavedData: boolean;
  forgetSavedData: () => void;
}

const CheckoutDraftContext = createContext<CheckoutDraftContextValue | null>(null);

export function CheckoutDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CheckoutDraft>(() => {
    const saved = readStorage<CheckoutDraft | null>(storageKeys.checkout, null, (value): value is CheckoutDraft | null =>
      value === null || isDraft(value),
    );
    return saved
      ? {
          ...emptyDraft,
          ...saved,
          customer: { ...emptyDraft.customer, ...saved.customer },
          address: { ...emptyAddress, ...saved.address },
          payment: { ...emptyDraft.payment, ...saved.payment },
        }
      : emptyDraft;
  });

  useEffect(() => {
    writeStorage(storageKeys.checkout, draft);
  }, [draft]);

  const setCustomer = useCallback(
    (patch: Partial<CustomerInfo>) => setDraft((current) => ({ ...current, customer: { ...current.customer, ...patch } })),
    [],
  );
  const setMode = useCallback((mode: FulfillmentMode) => setDraft((current) => ({ ...current, mode })), []);
  const setAddress = useCallback(
    (patch: Partial<Address>) => setDraft((current) => ({ ...current, address: { ...current.address, ...patch } })),
    [],
  );
  const setPayment = useCallback(
    (patch: Partial<PaymentChoice>) => setDraft((current) => ({ ...current, payment: { ...current.payment, ...patch } })),
    [],
  );
  const forgetSavedData = useCallback(() => {
    removeStorage(storageKeys.checkout);
    setDraft(emptyDraft);
  }, []);

  const hasSavedData = Boolean(draft.customer.name || draft.customer.phone || draft.address.street);

  const value = useMemo(
    () => ({ draft, setCustomer, setMode, setAddress, setPayment, hasSavedData, forgetSavedData }),
    [draft, setCustomer, setMode, setAddress, setPayment, hasSavedData, forgetSavedData],
  );

  return <CheckoutDraftContext value={value}>{children}</CheckoutDraftContext>;
}

export function useCheckoutDraft(): CheckoutDraftContextValue {
  const context = use(CheckoutDraftContext);
  if (!context) throw new Error('useCheckoutDraft must be used inside CheckoutDraftProvider');
  return context;
}
