import { Info } from 'lucide-react';
import { store } from '../../data/store';
import { cn } from '../../lib/cn';

/** Page-level reminder that the catalog is a demo. */
export function DemoFootnote({ className }: { className?: string }) {
  if (!store.demoMode) return null;
  return (
    <p className={cn('flex items-start justify-center gap-2 px-4 text-center text-[13px] leading-snug text-ink-2', className)}>
      <Info className="mt-px size-4 shrink-0" aria-hidden />
      <span>
        Ambiente de demonstração: preços, avaliações, promoções e pedidos são fictícios. Nenhum pagamento é processado.
      </span>
    </p>
  );
}
