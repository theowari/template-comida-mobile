import { Bike, Check, Clock, LoaderCircle, MapPin, Store } from 'lucide-react';
import { useRef, useState } from 'react';
import { store } from '../../data/store';
import { useCheckoutDraft } from '../../hooks/useCheckoutDraft';
import { brazilianStates, CepNotFoundError, lookupCep } from '../../lib/cep';
import { validateAddress } from '../../lib/checkout';
import { cn } from '../../lib/cn';
import { formatBRL } from '../../lib/format';
import { formatCep, onlyDigits } from '../../lib/masks';
import type { Address, FulfillmentMode } from '../../types';
import { SelectField, TextField } from '../ui/Field';

const modeOptions: { id: FulfillmentMode; label: string; icon: typeof Bike; detail: string; enabled: boolean }[] = [
  {
    id: 'entrega',
    label: 'Entrega',
    icon: Bike,
    detail: `${store.delivery.estimate} · ${formatBRL(store.delivery.fee)}`,
    enabled: store.modes.delivery,
  },
  {
    id: 'retirada',
    label: 'Retirada',
    icon: Store,
    detail: `${store.pickup.estimate} · sem taxa`,
    enabled: store.modes.pickup,
  },
];

export function DeliveryStep({ showErrors }: { showErrors: boolean }) {
  const { draft, setMode } = useCheckoutDraft();
  const options = modeOptions.filter((option) => option.enabled);

  return (
    <div className="space-y-6">
      {options.length > 1 ? (
        <fieldset>
          <legend className="sr-only">Forma de receber o pedido</legend>
          <div className="grid grid-cols-2 gap-3">
            {options.map((option) => {
              const Icon = option.icon;
              const checked = draft.mode === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    'press relative flex cursor-pointer flex-col gap-1 rounded-2xl border-[1.5px] bg-surface p-4 transition-[border-color,background-color] duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink',
                    checked ? 'border-brand bg-brand-50' : 'border-line-strong hover:border-ink/35',
                  )}
                >
                  <input
                    type="radio"
                    name="modo"
                    value={option.id}
                    checked={checked}
                    onChange={() => setMode(option.id)}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between">
                    <Icon className="size-6 text-brand" strokeWidth={1.8} aria-hidden />
                    <span
                      aria-hidden
                      className={cn(
                        'grid size-5 place-items-center rounded-full border-[1.5px]',
                        checked ? 'border-brand bg-brand text-white' : 'border-line-strong',
                      )}
                    >
                      {checked ? <Check className="size-3" strokeWidth={3.5} /> : null}
                    </span>
                  </span>
                  <span className="mt-1 text-[16px] font-bold">{option.label}</span>
                  <span className="tabular text-[13px] text-ink-2">{option.detail}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {draft.mode === 'entrega' ? <AddressForm showErrors={showErrors} /> : <PickupInfo />}
    </div>
  );
}

function PickupInfo() {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-card">
      <p className="flex items-start gap-2.5 text-[15px]">
        <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        <span>
          <span className="block font-semibold">Retire em {store.pickup.address}</span>
          <span className="block text-[14px] text-ink-2">{store.openingHours}</span>
        </span>
      </p>
      <p className="mt-3 flex items-center gap-2.5 text-[14px] text-ink-2">
        <Clock className="size-5 shrink-0" aria-hidden />
        Fica pronto em cerca de {store.pickup.estimate} depois da confirmação.
      </p>
    </div>
  );
}

type CepState = 'idle' | 'loading' | 'found' | 'not-found' | 'error';

const cepHints: Record<CepState, string | undefined> = {
  idle: undefined,
  loading: 'Buscando o endereço...',
  found: 'Endereço encontrado. Confira e informe o número.',
  'not-found': 'Não encontramos esse CEP. Confira os números ou preencha o endereço abaixo.',
  error: 'Não conseguimos buscar o CEP agora. Preencha o endereço abaixo.',
};

function AddressForm({ showErrors }: { showErrors: boolean }) {
  const { draft, setAddress } = useCheckoutDraft();
  const { address } = draft;
  const [touched, setTouched] = useState<Partial<Record<keyof Address, boolean>>>({});
  const [cepState, setCepState] = useState<CepState>('idle');
  const numberRef = useRef<HTMLInputElement>(null);
  const pending = useRef<AbortController | null>(null);

  const errors = validateAddress(address);
  const errorFor = (field: keyof Address) => (showErrors || touched[field] ? errors[field] : undefined);
  const touch = (field: keyof Address) => () => setTouched((current) => ({ ...current, [field]: true }));
  const bind = (field: keyof Address) => ({
    value: address[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setAddress({ [field]: event.target.value }),
    onBlur: touch(field),
    error: errorFor(field),
  });

  const onCepChange = (value: string) => {
    const digits = onlyDigits(value).slice(0, 8);
    const previous = onlyDigits(address.cep);
    setAddress({ cep: digits });
    if (digits.length < 8) {
      pending.current?.abort();
      setCepState('idle');
      return;
    }
    if (digits === previous || store.cepLookup !== 'viacep') return;

    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setCepState('loading');
    lookupCep(digits, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setAddress({ street: result.street, district: result.district, city: result.city, state: result.state });
        setCepState('found');
        numberRef.current?.focus();
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setCepState(error instanceof CepNotFoundError ? 'not-found' : 'error');
      });
  };

  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 text-[15px] font-bold">Endereço de entrega</legend>
      <TextField
        label="CEP"
        name="cep"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="00000-000"
        enterKeyHint="next"
        value={formatCep(address.cep)}
        onChange={(event) => onCepChange(event.target.value)}
        onBlur={touch('cep')}
        error={errorFor('cep')}
        hint={cepHints[cepState]}
        containerClassName="sm:max-w-[240px]"
        trailing={
          cepState === 'loading' ? (
            <LoaderCircle className="size-5 animate-spin text-ink-2 motion-reduce:animate-none" aria-hidden />
          ) : cepState === 'found' ? (
            <Check className="size-5 text-success" strokeWidth={2.5} aria-hidden />
          ) : null
        }
      />
      <TextField label="Rua" name="street" autoComplete="address-line1" enterKeyHint="next" {...bind('street')} />
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3">
        <TextField
          ref={numberRef}
          label="Número"
          name="number"
          inputMode="text"
          enterKeyHint="next"
          {...bind('number')}
        />
        <TextField label="Complemento" name="complement" optional autoComplete="address-line2" placeholder="Apto, bloco" {...bind('complement')} />
      </div>
      <TextField label="Bairro" name="district" autoComplete="address-level3" enterKeyHint="next" {...bind('district')} />
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
        <TextField label="Cidade" name="city" autoComplete="address-level2" enterKeyHint="next" {...bind('city')} />
        <SelectField
          label="Estado"
          name="state"
          autoComplete="address-level1"
          value={address.state}
          onChange={(event) => setAddress({ state: event.target.value })}
          onBlur={touch('state')}
          error={errorFor('state')}
        >
          <option value="">UF</option>
          {brazilianStates.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </SelectField>
      </div>
      <TextField
        label="Ponto de referência"
        name="reference"
        optional
        placeholder="Ex.: portão azul, perto da padaria"
        enterKeyHint="done"
        {...bind('reference')}
      />
    </fieldset>
  );
}
