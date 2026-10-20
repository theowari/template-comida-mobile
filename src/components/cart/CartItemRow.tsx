import { Pencil } from 'lucide-react';
import { useOverlay } from '../../hooks/useOverlay';
import { formatBRL } from '../../lib/format';
import { imageSizes } from '../../lib/imageSizes';
import { describeSelections, hasOptions, lineTotal } from '../../lib/pricing';
import { getProduct } from '../../themes';
import type { CartItem } from '../../types';
import { FoodImage } from '../ui/FoodImage';
import { QuantityStepper } from '../ui/QuantityStepper';

interface CartItemRowProps {
  item: CartItem;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onQuantity, onRemove }: CartItemRowProps) {
  const productSheet = useOverlay('produto');
  const product = getProduct(item.productId);
  if (!product) return null;
  const details = describeSelections(product, item.selections);

  return (
    <div className="flex gap-3 py-4">
      <FoodImage image={{ ...product.image, alt: '' }} sizes={imageSizes.bagLine} className="size-16 shrink-0 rounded-xl bg-ground-2 object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] leading-snug font-semibold">{product.name}</h3>
          <p className="tabular shrink-0 text-[15px] font-semibold">{formatBRL(lineTotal(product, item))}</p>
        </div>
        {details.length > 0 ? (
          <ul className="mt-0.5 text-[13px] leading-snug text-ink-2">
            {details.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
        {item.notes ? <p className="mt-0.5 text-[13px] leading-snug text-ink-2 italic">Obs.: {item.notes}</p> : null}
        <div className="mt-2 flex items-center justify-between gap-2">
          {hasOptions(product) ? (
            <button
              type="button"
              onClick={() => productSheet.open(product.id, { editar: item.lineId })}
              className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-2 text-[14px] font-semibold text-brand-dark hover:bg-brand-50"
            >
              <Pencil className="size-4" aria-hidden />
              Editar<span className="sr-only"> {product.name}</span>
            </button>
          ) : (
            <span />
          )}
          <QuantityStepper value={item.quantity} onChange={onQuantity} onRemove={onRemove} label={product.name} size="sm" />
        </div>
      </div>
    </div>
  );
}
