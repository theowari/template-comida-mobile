import { Check, CircleAlert, SearchX, Users } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useOverlay } from '../../hooks/useOverlay';
import { addedMessage } from '../../hooks/useProductActions';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../lib/cn';
import { formatBRL } from '../../lib/format';
import { imageSizes } from '../../lib/imageSizes';
import { initialSelections, unitPrice, validateSelections } from '../../lib/pricing';
import { getThemeProduct } from '../../themes';
import type { CartItem, OptionGroup, Product, Selections } from '../../types';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { TextAreaField } from '../ui/Field';
import { FoodImage } from '../ui/FoodImage';
import { QuantityStepper } from '../ui/QuantityStepper';
import { CloseButton, Sheet, SheetFooter } from '../ui/Sheet';
import { FavoriteButton, ProductPrice, ProductRating } from './ProductCard';

const NOTES_MAX = 140;

/** Product sheet driven by ?produto=<id> (and &editar=<lineId> to edit a bag item). */
export function ProductDetails() {
  const overlay = useOverlay('produto');
  const cart = useCart();
  const { theme } = useTheme();
  const product = getThemeProduct(theme, overlay.value);
  const editLineId = overlay.params.get('editar');
  const editingItem = editLineId ? cart.items.find((item) => item.lineId === editLineId) : undefined;

  // Each opening starts a fresh form; after closing, the last content stays while the sheet animates out.
  const openKey = overlay.isOpen ? `${overlay.value}|${editLineId ?? ''}` : null;
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [display, setDisplay] = useState<{ count: number; productId: string | null; edit?: CartItem }>({
    count: 0,
    productId: null,
  });
  if (openKey !== lastKey) {
    setLastKey(openKey);
    if (openKey) setDisplay((current) => ({ count: current.count + 1, productId: overlay.value, edit: editingItem }));
  }
  const shown = overlay.isOpen ? product : getThemeProduct(theme, display.productId);

  return (
    <Sheet open={overlay.isOpen} onClose={overlay.close} labelledBy="produto-titulo" width={600}>
      {shown ? (
        <ProductConfigurator
          key={`${display.count}:${shown.id}`}
          product={shown}
          editingItem={display.edit}
          onClose={overlay.close}
        />
      ) : (
        <div className="relative">
          <CloseButton onClick={overlay.close} className="absolute top-2 right-2" />
          <h2 id="produto-titulo" className="sr-only">
            Produto não encontrado
          </h2>
          <EmptyState icon={SearchX} title="Produto não encontrado" headingLevel="h3">
            Ele pode ter saído do cardápio. Que tal escolher outra opção?
          </EmptyState>
        </div>
      )}
    </Sheet>
  );
}

interface ConfiguratorProps {
  product: Product;
  editingItem?: CartItem;
  onClose: () => void;
}

function ProductConfigurator({ product, editingItem, onClose }: ConfiguratorProps) {
  const cart = useCart();
  const toast = useToast();
  const { theme } = useTheme();
  const bag = useOverlay('sacola');
  const [selections, setSelections] = useState<Selections>(() => editingItem?.selections ?? initialSelections(product));
  const [notes, setNotes] = useState(editingItem?.notes ?? '');
  const [quantity, setQuantity] = useState(editingItem?.quantity ?? 1);
  const [showErrors, setShowErrors] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const groupRefs = useRef<Record<string, HTMLFieldSetElement | null>>({});

  const errors = validateSelections(product, selections);
  const total = unitPrice(product, selections) * quantity;
  const groups = product.optionGroups ?? [];

  const toggle = (group: OptionGroup, choiceId: string) => {
    setSelections((current) => {
      const chosen = current[group.id] ?? [];
      if (group.max === 1) {
        // Radio group (required) or single optional checkbox.
        if (group.min === 0 && chosen.includes(choiceId)) return { ...current, [group.id]: [] };
        return { ...current, [group.id]: [choiceId] };
      }
      if (chosen.includes(choiceId)) return { ...current, [group.id]: chosen.filter((id) => id !== choiceId) };
      if (chosen.length >= group.max) return current;
      return { ...current, [group.id]: [...chosen, choiceId] };
    });
  };

  const submit = () => {
    const firstInvalid = groups.find((group) => errors[group.id]);
    if (firstInvalid) {
      setShowErrors(true);
      const element = groupRefs.current[firstInvalid.id];
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      element?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
      setAnnouncement(`${firstInvalid.title}: ${errors[firstInvalid.id]}`);
      return;
    }

    if (editingItem) {
      cart.update(editingItem.lineId, selections, notes, quantity);
      onClose();
      return;
    }

    cart.add(product.id, selections, notes, quantity);
    onClose();
    toast.show({ message: addedMessage(product, quantity), action: { label: 'Ver sacola', onClick: () => bag.open() } });
  };

  return (
    <>
      <div className="sheet-body">
        <div className="relative aspect-[16/10] bg-ground-2 lg:aspect-[16/9]">
          <FoodImage
            image={product.image}
            priority
            sizes={imageSizes.sheet}
            className="absolute inset-0 size-full object-cover"
          />
          <CloseButton
            onClick={onClose}
            label="Fechar detalhes do produto"
            className="absolute top-3 right-3 bg-surface/95 shadow-float-strong hover:bg-surface"
          />
        </div>

        <div className="px-4 pt-4 pb-5 sm:px-5">
          <div className="flex items-start gap-3">
            <h2 id="produto-titulo" className="min-w-0 flex-1 font-heading text-[22px] leading-tight font-bold tracking-[-0.02em]">
              {product.name}
            </h2>
            <FavoriteButton product={product} className="relative shadow-none ring-1 ring-line" />
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{product.description}</p>
          {product.serves ? (
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-2">
              <Users className="size-4" aria-hidden />
              {product.serves}
            </p>
          ) : null}
          <ProductRating product={product} />
          <ProductPrice product={product} className="mt-3" />
        </div>

        {groups.map((group) => (
          <OptionGroupFieldset
            key={group.id}
            ref={(element) => {
              groupRefs.current[group.id] = element;
            }}
            product={product}
            group={group}
            chosen={selections[group.id] ?? []}
            error={showErrors ? errors[group.id] : undefined}
            onToggle={(choiceId) => toggle(group, choiceId)}
          />
        ))}

        <div className="border-t-8 border-ground px-4 pt-5 pb-6 sm:px-5">
          <TextAreaField
            label="Alguma observação?"
            optional
            placeholder={theme.brand.notesPlaceholder}
            maxLength={NOTES_MAX}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            hint={`${notes.length}/${NOTES_MAX} caracteres. Pedidos com custo extra entram nas opções acima.`}
          />
        </div>
        <p className="sr-only" aria-live="assertive">
          {announcement}
        </p>
      </div>

      <SheetFooter className="flex items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
        <Button size="lg" className="min-w-0 flex-1 justify-between px-5" onClick={submit}>
          <span>{editingItem ? 'Salvar' : 'Adicionar'}</span>
          <span className="tabular">{formatBRL(total)}</span>
        </Button>
      </SheetFooter>
    </>
  );
}

interface OptionGroupFieldsetProps {
  ref: (element: HTMLFieldSetElement | null) => void;
  product: Product;
  group: OptionGroup;
  chosen: string[];
  error?: string;
  onToggle: (choiceId: string) => void;
}

function helperText(group: OptionGroup): string {
  if (group.description) return group.description;
  if (group.min === 1 && group.max === 1) return 'Escolha 1 opção';
  if (group.min === 0) return group.max === 1 ? 'Opcional' : `Opcional · escolha até ${group.max}`;
  return `Escolha de ${group.min} a ${group.max}`;
}

function OptionGroupFieldset({ ref, product, group, chosen, error, onToggle }: OptionGroupFieldsetProps) {
  const titleId = `${product.id}-${group.id}-titulo`;
  const errorId = `${product.id}-${group.id}-erro`;
  const isRadio = group.max === 1 && group.min === 1;
  const atMax = chosen.length >= group.max;
  const decisionNeeded = group.min > 0 && (group.defaultChoiceIds?.length ?? 0) < group.min;
  const satisfied = chosen.length >= group.min;

  return (
    <fieldset ref={ref} aria-labelledby={titleId} aria-describedby={error ? errorId : undefined} className="scroll-mt-2 border-t-8 border-ground">
      <div className="sticky top-0 z-[3] flex items-center gap-3 bg-ground-sticky px-4 py-3 sm:px-5">
        <div className="min-w-0 flex-1">
          <h3 id={titleId} className="text-[15px] leading-snug font-bold">
            {group.title}
          </h3>
          <p className="text-[13px] text-ink-2">{helperText(group)}</p>
        </div>
        {decisionNeeded ? (
          satisfied ? (
            <span className="inline-flex h-7 items-center gap-1 rounded-full bg-success-50 px-2.5 text-[12px] font-bold text-success">
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
              Ok
            </span>
          ) : (
            <span
              className={cn(
                'inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-bold tracking-[0.04em] uppercase',
                error ? 'bg-brand text-white' : 'bg-ink text-white',
              )}
            >
              Obrigatório
            </span>
          )
        ) : group.max > 1 && chosen.length > 0 ? (
          <span className="tabular text-[13px] font-semibold text-ink-2">
            {chosen.length}/{group.max}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 px-4 pt-3 text-[13px] font-semibold text-brand-dark sm:px-5">
          <CircleAlert className="size-4" aria-hidden />
          {error}
        </p>
      ) : null}
      <ul className="divide-y divide-line px-4 sm:px-5">
        {group.choices.map((choice) => {
          const checked = chosen.includes(choice.id);
          const disabled = !isRadio && !checked && atMax && group.max > 1;
          return (
            <li key={choice.id}>
              <label
                className={cn(
                  'flex min-h-14 items-center gap-3 py-3',
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className={cn('block text-[15px] leading-snug', checked && 'font-semibold')}>{choice.name}</span>
                  {choice.description ? <span className="block text-[13px] text-ink-2">{choice.description}</span> : null}
                </span>
                {choice.priceDelta > 0 ? (
                  <span className="tabular shrink-0 text-[14px] font-medium text-ink">+ {formatBRL(choice.priceDelta)}</span>
                ) : null}
                <input
                  type={isRadio ? 'radio' : 'checkbox'}
                  name={`${product.id}-${group.id}`}
                  value={choice.id}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(choice.id)}
                  className="size-5 shrink-0 cursor-[inherit] accent-brand"
                />
              </label>
            </li>
          );
        })}
      </ul>
      {group.max > 1 && atMax ? (
        <p className="px-4 pb-3 text-[13px] text-ink-2 sm:px-5">
          Você chegou ao máximo de {group.max}. Desmarque um item para trocar.
        </p>
      ) : null}
    </fieldset>
  );
}
