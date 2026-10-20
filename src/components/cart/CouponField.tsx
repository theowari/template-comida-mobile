import { TicketPercent, X } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';
import { coupons } from '../../data/promotions';
import { useCart } from '../../hooks/useCart';
import { formatBRL } from '../../lib/format';
import type { CouponStatus } from '../../lib/pricing';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

function couponMessage(status: CouponStatus): string | null {
  switch (status.state) {
    case 'invalid':
      return 'Não encontramos esse cupom. Confira o código e tente de novo.';
    case 'below-minimum':
      return `Esse cupom vale a partir de ${formatBRL(status.coupon.minSubtotal)}. Faltam ${formatBRL(status.missing)}.`;
    case 'not-applicable':
      return status.reason;
    default:
      return null;
  }
}

export function CouponField() {
  const { couponCode, totals, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const listId = useId();

  const apply = (value: string) => {
    if (!value.trim()) {
      setError('Digite o código do cupom.');
      return;
    }
    const status = applyCoupon(value);
    const message = couponMessage(status);
    setError(message);
    if (!message) setCode('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    apply(code);
  };

  if (couponCode) {
    const status = totals.coupon;
    const warning = status.state === 'applied' ? null : couponMessage(status);
    return (
      <div className={`flex items-start gap-3 rounded-xl px-3.5 py-3 ${warning ? 'bg-warning-50' : 'bg-success-50'}`}>
        <TicketPercent className={`mt-0.5 size-5 shrink-0 ${warning ? 'text-warning' : 'text-success'}`} aria-hidden />
        <div className="min-w-0 flex-1 text-[14px] leading-snug">
          <p className="font-semibold">
            Cupom {couponCode} {warning ? 'guardado' : 'aplicado'}
          </p>
          <p className={warning ? 'text-[#5c3700]' : 'text-success'}>
            {warning ?? (status.state === 'applied' ? `Você economiza ${formatBRL(status.discount)}.` : '')}
          </p>
        </div>
        <button
          type="button"
          onClick={removeCoupon}
          aria-label={`Remover cupom ${couponCode}`}
          className="press -m-1.5 grid size-10 shrink-0 place-items-center rounded-full hover:bg-black/5"
        >
          <X className="size-[18px]" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex items-start gap-2" noValidate>
        <TextField
          label="Cupom de desconto"
          containerClassName="min-w-0 flex-1"
          placeholder="Digite o código"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            setError(null);
          }}
          error={error}
          className="uppercase placeholder:normal-case"
        />
        <Button type="submit" variant="secondary" className="mt-[26px] shrink-0">
          Aplicar
        </Button>
      </form>
      <div className="mt-3">
        <p id={listId} className="text-[13px] font-medium text-ink-2">
          Cupons disponíveis (demonstrativos)
        </p>
        <ul aria-labelledby={listId} className="mt-2 space-y-2">
          {coupons.map((coupon) => (
            <li key={coupon.code} className="flex items-center gap-3 rounded-xl border border-dashed border-line-strong px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold tracking-[0.04em]">{coupon.code}</p>
                <p className="text-[13px] leading-snug text-ink-2">{coupon.description}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => apply(coupon.code)} aria-label={`Usar cupom ${coupon.code}`}>
                Usar
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
