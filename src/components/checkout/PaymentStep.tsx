import { Banknote, Check, CircleAlert, CreditCard, QrCode, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { paymentMethods } from '../../data/store';
import { useCheckoutDraft } from '../../hooks/useCheckoutDraft';
import { validatePayment } from '../../lib/checkout';
import { cn } from '../../lib/cn';
import { parseMoneyInput } from '../../lib/masks';
import { paymentProvider } from '../../services/payments';
import type { Cents, PaymentMethodId } from '../../types';
import { TextField } from '../ui/Field';
import { Notice } from '../ui/Notice';

const icons: Record<PaymentMethodId, LucideIcon> = {
  pix: QrCode,
  'cartao-entrega': CreditCard,
  dinheiro: Banknote,
};

export function paymentLabel(method: PaymentMethodId | null, mode: 'entrega' | 'retirada'): string {
  if (method === 'cartao-entrega') return mode === 'retirada' ? 'Cartão na retirada' : 'Cartão na entrega';
  return paymentMethods.find((option) => option.id === method)?.label ?? 'Não escolhido';
}

const centsToInput = (cents: Cents | null) => (cents ? (cents / 100).toFixed(2).replace('.', ',') : '');

export function PaymentStep({ showErrors, total }: { showErrors: boolean; total: Cents }) {
  const { draft, setPayment } = useCheckoutDraft();
  const { payment } = draft;
  const [changeText, setChangeText] = useState(centsToInput(payment.changeFor));
  const [changeTouched, setChangeTouched] = useState(false);
  const errors = validatePayment(payment, total);
  const methodError = showErrors ? errors.method : undefined;
  const changeError = showErrors || changeTouched ? errors.changeFor : undefined;

  return (
    <div className="space-y-5">
      {paymentProvider.isDemo ? (
        <Notice>
          <strong className="font-semibold text-ink">Modo demonstração:</strong> nenhuma cobrança é feita. Pix online depende da
          integração com um provedor de pagamento.
        </Notice>
      ) : null}

      <fieldset aria-describedby={methodError ? 'pagamento-erro' : undefined}>
        <legend className="sr-only">Forma de pagamento</legend>
        <div className="space-y-3">
          {paymentMethods
            .filter((option) => option.enabled)
            .map((option) => {
              const Icon = icons[option.id];
              const checked = payment.method === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    'press flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] bg-surface p-4 transition-[border-color,background-color] duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink',
                    checked ? 'border-brand bg-brand-50' : methodError ? 'border-brand/60' : 'border-line-strong hover:border-ink/35',
                  )}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={option.id}
                    checked={checked}
                    onChange={() => setPayment({ method: option.id })}
                    className="sr-only"
                  />
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ground text-brand">
                    <Icon className="size-[22px]" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold">{paymentLabel(option.id, draft.mode)}</span>
                    <span className="block text-[13px] leading-snug text-ink-2">{option.description}</span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full border-[1.5px]',
                      checked ? 'border-brand bg-brand text-white' : 'border-line-strong',
                    )}
                  >
                    {checked ? <Check className="size-3" strokeWidth={3.5} /> : null}
                  </span>
                </label>
              );
            })}
        </div>
        {methodError ? (
          <p id="pagamento-erro" className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-brand-dark">
            <CircleAlert className="size-4" aria-hidden />
            {methodError}
          </p>
        ) : null}
      </fieldset>

      {payment.method === 'dinheiro' ? (
        <div className="space-y-3 rounded-2xl bg-surface p-4 shadow-card">
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={payment.needsChange}
              onChange={(event) => setPayment({ needsChange: event.target.checked })}
              className="size-5 accent-brand"
            />
            <span className="text-[15px] font-medium">Vou precisar de troco</span>
          </label>
          {payment.needsChange ? (
            <TextField
              label="Troco para quanto?"
              name="troco"
              inputMode="decimal"
              placeholder="Ex.: 100,00"
              value={changeText}
              onChange={(event) => {
                const text = event.target.value.replace(/[^\d,]/g, '');
                setChangeText(text);
                setPayment({ changeFor: parseMoneyInput(text) });
              }}
              onBlur={() => setChangeTouched(true)}
              error={changeError}
              hint="Informe o valor da nota que você vai usar."
              leading="R$"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
