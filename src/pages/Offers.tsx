import { TicketPercent } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ProductGrid, ProductSection } from '../components/catalog/ProductSection';
import { ComboBanner } from '../components/home/ComboBanner';
import { DemoFootnote } from '../components/home/DemoFootnote';
import { PageHeader } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { products } from '../data/products';
import { coupons } from '../data/promotions';
import { useCart } from '../hooks/useCart';
import { useOverlay } from '../hooks/useOverlay';
import { useToast } from '../hooks/useToast';
import { formatBRL } from '../lib/format';

const combos = products.filter((product) => product.categoryId === 'combos' && product.available);

export function Offers() {
  const location = useLocation();
  const { applyCoupon } = useCart();
  const toast = useToast();
  const bag = useOverlay('sacola');

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    target?.scrollIntoView({ block: 'start' });
  }, [location.hash]);

  const redeemCoupon = (code: string) => {
    const status = applyCoupon(code);
    switch (status.state) {
      case 'applied':
        toast.show({ message: `Cupom ${code} aplicado na sacola.`, action: { label: 'Ver sacola', onClick: () => bag.open() } });
        break;
      case 'below-minimum':
        toast.show({
          tone: 'error',
          message: `${code} vale a partir de ${formatBRL(status.coupon.minSubtotal)}. Faltam ${formatBRL(status.missing)} na sacola.`,
        });
        break;
      case 'not-applicable':
        toast.show({ tone: 'error', message: status.reason });
        break;
      default:
        toast.show({ tone: 'error', message: 'Esse cupom não está disponível.' });
    }
  };

  return (
    <>
      <PageHeader title="Ofertas" />
      <div className="space-y-8 px-4 pt-2 lg:px-0">
        <ComboBanner />

        <ProductSection id="combos" title="Combos">
          <ProductGrid products={combos} columns={3} />
        </ProductSection>

        <section id="cupons" aria-labelledby="cupons-titulo" className="scroll-mt-24">
          <h2 id="cupons-titulo" className="text-xl font-bold tracking-[-0.015em] lg:text-2xl">
            Cupons
          </h2>
          <p className="mt-1 text-[14px] text-ink-2">Cupons demonstrativos. O desconto aparece separado no resumo da sacola.</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {coupons.map((coupon) => (
              <li key={coupon.code} className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-card">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                  <TicketPercent className="size-6" strokeWidth={1.8} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold tracking-[0.04em]">{coupon.code}</p>
                  <p className="text-[13px] leading-snug text-ink-2">{coupon.description}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => redeemCoupon(coupon.code)} aria-label={`Usar cupom ${coupon.code} na sacola`}>
                  Usar
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <DemoFootnote />
      </div>
    </>
  );
}
