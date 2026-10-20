import { ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { OrderSummary } from '../components/cart/OrderSummary';
import { CheckoutProgress } from '../components/checkout/CheckoutProgress';
import { ThemeBar } from '../components/layout/ThemeBar';
import { ContactStep } from '../components/checkout/ContactStep';
import { DeliveryStep } from '../components/checkout/DeliveryStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { ReviewStep } from '../components/checkout/ReviewStep';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LogoMark } from '../components/ui/Logo';
import { Notice } from '../components/ui/Notice';
import { store } from '../data/store';
import { useCart } from '../hooks/useCart';
import { useCheckoutDraft } from '../hooks/useCheckoutDraft';
import { useTheme } from '../hooks/useTheme';
import { checkoutSteps, firstIncompleteStep, stepIsValid, type StepId } from '../lib/checkout';
import { formatBRL } from '../lib/format';
import { describeSelections, lineTotal, unitPrice } from '../lib/pricing';
import { orderService } from '../services/orders';
import { paymentProvider } from '../services/payments';
import { getProduct } from '../themes';
import type { OrderLine } from '../types';

interface CheckoutLocationState {
  /** This entry was pushed by the checkout itself, so "back" stays inside it. */
  checkoutStep?: boolean;
  /** Opened from "Alterar" on the review: saving returns to the review. */
  returnToReview?: boolean;
}

export function Checkout() {
  const cart = useCart();
  const { draft } = useCheckoutDraft();
  const { theme } = useTheme();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as CheckoutLocationState;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [attempted, setAttempted] = useState<Partial<Record<StepId, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { totals } = cart;
  const firstIncomplete = checkoutSteps.findIndex((step) => step.id === firstIncompleteStep(draft, totals.total));
  const requested = checkoutSteps.findIndex((step) => step.id === params.get('etapa'));
  // A later step is only reachable when the earlier ones are complete.
  const currentIndex = requested === -1 ? firstIncomplete : Math.min(requested, firstIncomplete);
  const step = checkoutSteps[currentIndex];
  const isReview = step.id === 'revisao';
  const belowMinimum = totals.missingForMinimum > 0;

  // Pin the resolved step in the URL once, so completing a field never jumps ahead on its own.
  useEffect(() => {
    if (params.get('etapa') !== step.id) {
      setParams({ etapa: step.id }, { replace: true, state: location.state });
    }
  }, []);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [currentIndex]);

  const goToStep = (target: StepId, extra: CheckoutLocationState = {}) => {
    setParams({ etapa: target }, { state: { checkoutStep: true, ...extra } satisfies CheckoutLocationState });
  };

  const goBack = () => {
    if (state.checkoutStep) navigate(-1);
    else if (currentIndex > 0) setParams({ etapa: checkoutSteps[currentIndex - 1].id }, { replace: true });
    else if (location.key !== 'default') navigate(-1);
    else navigate('/', { replace: true });
  };

  const placeOrder = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const lines: OrderLine[] = cart.items.flatMap((item) => {
        const product = getProduct(item.productId);
        if (!product) return [];
        return [
          {
            productId: product.id,
            name: product.name,
            quantity: item.quantity,
            unitPrice: unitPrice(product, item.selections),
            lineTotal: lineTotal(product, item),
            details: describeSelections(product, item.selections),
            notes: item.notes,
          },
        ];
      });
      const order = await orderService.createOrder({
        theme: theme.id,
        customer: draft.customer,
        mode: draft.mode,
        address: draft.mode === 'entrega' ? draft.address : null,
        payment: draft.payment,
        lines,
        totals: { subtotal: totals.subtotal, deliveryFee: totals.deliveryFee, discount: totals.discount, total: totals.total },
        couponCode: totals.coupon.state === 'applied' ? totals.coupon.coupon.code : null,
      });
      await paymentProvider.startPayment(order);
      navigate(`/pedido/${order.id}`, { replace: true, state: { justPlaced: true } });
      cart.clear();
      cart.removeCoupon();
    } catch {
      setSubmitError('Não foi possível registrar o pedido. Verifique sua conexão e tente de novo.');
      setSubmitting(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isReview) {
      if (!belowMinimum) void placeOrder();
      return;
    }
    if (!stepIsValid(step.id, draft, totals.total)) {
      setAttempted((current) => ({ ...current, [step.id]: true }));
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"], #pagamento-erro')?.focus());
      return;
    }
    if (state.returnToReview) navigate(-1);
    else goToStep(checkoutSteps[currentIndex + 1].id);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-dvh">
        <ThemeBar />
        <CheckoutTopBar onBack={goBack} />
        <EmptyState icon={ShoppingBag} title="Sua sacola está vazia" className="pt-16" actions={<ButtonLink to="/cardapio">Ver cardápio</ButtonLink>}>
          Adicione produtos para finalizar um pedido.
        </EmptyState>
      </div>
    );
  }

  const primaryLabel = isReview
    ? `Confirmar pedido · ${formatBRL(totals.total)}`
    : state.returnToReview
      ? 'Salvar e revisar'
      : 'Continuar';

  return (
    <div className="min-h-dvh">
      <ThemeBar />
      <div className="sticky top-0 z-30 border-b border-line bg-ground pt-safe">
        <CheckoutTopBar onBack={goBack} subtitle={`Etapa ${currentIndex + 1} de ${checkoutSteps.length} · ${step.label}`} />
        <div className="mx-auto max-w-[1080px] px-4 pb-3 lg:px-8">
          <CheckoutProgress current={currentIndex} />
        </div>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 pt-5 pb-[calc(112px+env(safe-area-inset-bottom))] lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10 lg:px-8 lg:pb-16">
        <form id="checkout-form" noValidate onSubmit={onSubmit} aria-labelledby="etapa-titulo" className="min-w-0">
          <h2
            id="etapa-titulo"
            ref={headingRef}
            tabIndex={-1}
            className="mb-4 font-heading text-[22px] leading-tight font-bold tracking-[-0.02em] focus-visible:outline-none lg:text-[26px]"
          >
            {step.title}
          </h2>

          {step.id === 'dados' ? <ContactStep showErrors={Boolean(attempted.dados)} /> : null}
          {step.id === 'entrega' ? <DeliveryStep showErrors={Boolean(attempted.entrega)} /> : null}
          {step.id === 'pagamento' ? <PaymentStep showErrors={Boolean(attempted.pagamento)} total={totals.total} /> : null}
          {isReview ? <ReviewStep onEdit={(target) => goToStep(target, { returnToReview: true })} /> : null}

          {isReview && store.demoMode ? (
            <Notice tone="warning" className="mt-4">
              <strong className="font-semibold">Pedido demonstrativo.</strong> Ao confirmar, nada é enviado ao estabelecimento e
              nenhuma cobrança é feita.
            </Notice>
          ) : null}
          {isReview && belowMinimum ? (
            <Notice tone="warning" className="mt-4">
              Faltam {formatBRL(totals.missingForMinimum)} para o pedido mínimo de {formatBRL(store.delivery.minOrder)}.
            </Notice>
          ) : null}
          {submitError ? (
            <p role="alert" className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-[14px] font-medium text-brand-dark">
              {submitError}
            </p>
          ) : null}

          <div className="mt-6 hidden lg:block">
            <Button
              type="submit"
              size="lg"
              className="w-full max-w-sm"
              loading={submitting}
              loadingLabel="Registrando pedido..."
              disabled={isReview && belowMinimum}
            >
              {isReview ? <Lock className="size-[18px]" aria-hidden /> : null}
              {primaryLabel}
            </Button>
          </div>
        </form>

        <aside aria-label="Resumo do pedido" className="hidden lg:sticky lg:top-36 lg:block">
          <div className="rounded-[20px] bg-surface p-5 shadow-card">
            <h2 className="text-[17px] font-bold">Seu pedido</h2>
            <ul className="mt-3 space-y-2 border-b border-line pb-4 text-[14px]">
              {cart.items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <li key={item.lineId} className="flex gap-2">
                    <span className="tabular w-7 shrink-0 text-ink-2">{item.quantity}x</span>
                    <span className="min-w-0 flex-1">{product.name}</span>
                    <span className="tabular shrink-0">{formatBRL(lineTotal(product, item))}</span>
                  </li>
                );
              })}
            </ul>
            <OrderSummary totals={totals} mode={draft.mode} className="mt-4" />
          </div>
        </aside>
      </main>

      {/* Phones: the primary action and the total stay in reach of the thumb. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-bar lg:hidden">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <div className="shrink-0 leading-tight">
            <p className="text-[12px] text-ink-2">Total</p>
            <p className="tabular text-[18px] font-bold">{formatBRL(totals.total)}</p>
          </div>
          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            className="min-w-0 flex-1"
            loading={submitting}
            loadingLabel="Registrando..."
            disabled={isReview && belowMinimum}
          >
            {isReview ? 'Confirmar pedido' : primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckoutTopBar({ onBack, subtitle }: { onBack: () => void; subtitle?: string }) {
  const { theme } = useTheme();
  return (
    <div className="mx-auto flex h-16 max-w-[1080px] items-center gap-2 px-2 lg:px-6">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="press grid size-11 shrink-0 place-items-center rounded-full hover:bg-ground-2"
      >
        <ArrowLeft className="size-[22px]" aria-hidden />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] leading-tight font-bold">Finalizar pedido</h1>
        {subtitle ? <p className="truncate text-[13px] text-ink-2">{subtitle}</p> : null}
      </div>
      <Link to="/" aria-label={`${theme.brand.name.join(' ')}, voltar ao início`} className="mr-2 hidden rounded-md lg:block">
        <LogoMark className="size-9" />
      </Link>
    </div>
  );
}
