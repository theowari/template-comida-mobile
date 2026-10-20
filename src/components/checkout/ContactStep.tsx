import { useState } from 'react';
import { useCheckoutDraft } from '../../hooks/useCheckoutDraft';
import { validateCustomer } from '../../lib/checkout';
import { formatPhone, onlyDigits } from '../../lib/masks';
import type { CustomerInfo } from '../../types';
import { TextField } from '../ui/Field';

export function ContactStep({ showErrors }: { showErrors: boolean }) {
  const { draft, setCustomer } = useCheckoutDraft();
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerInfo, boolean>>>({});
  const errors = validateCustomer(draft.customer);
  const errorFor = (field: keyof CustomerInfo) => (showErrors || touched[field] ? errors[field] : undefined);
  const touch = (field: keyof CustomerInfo) => () => setTouched((current) => ({ ...current, [field]: true }));

  return (
    <div className="space-y-4">
      <TextField
        label="Nome"
        name="name"
        autoComplete="name"
        autoCapitalize="words"
        enterKeyHint="next"
        value={draft.customer.name}
        onChange={(event) => setCustomer({ name: event.target.value })}
        onBlur={touch('name')}
        error={errorFor('name')}
      />
      <TextField
        label="Celular com DDD"
        name="tel"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        enterKeyHint="done"
        placeholder="(00) 00000-0000"
        value={formatPhone(draft.customer.phone)}
        onChange={(event) => setCustomer({ phone: onlyDigits(event.target.value).slice(0, 11) })}
        onBlur={touch('phone')}
        hint="Usado só para falar com você sobre este pedido."
        error={errorFor('phone')}
      />
    </div>
  );
}
