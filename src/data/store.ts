import type { Cents, PaymentMethodId } from '../types';

/**
 * Store configuration. Everything here is demonstrative until the store
 * validates it operationally; replace with values from the backend.
 */
export const store = {
  name: 'Seu negócio',
  tagline: 'Sabor que chega até você.',
  greeting: 'Olá, seja bem-vindo!',

  /** When true, the UI labels prices, ratings, promotions and orders as demo. */
  demoMode: true,
  /** Ratings in the catalog are demo values; set to false to hide them. */
  showDemoRatings: true,

  delivery: {
    fee: 699 as Cents,
    estimate: '30–40 min',
    minOrder: 2000 as Cents,
  },
  pickup: {
    estimate: '20–25 min',
    address: 'Rua Exemplo, 123 · Centro',
  },
  /** Fulfillment modes offered by the store. */
  modes: { delivery: true, pickup: true },

  openingHours: 'Todos os dias, das 18h às 23h30',
  phone: '(00) 0000-0000',

  /** CEP lookup for address autofill. 'viacep' calls viacep.com.br. */
  cepLookup: 'viacep' as 'viacep' | 'none',
};

export interface PaymentMethodConfig {
  id: PaymentMethodId;
  label: string;
  description: string;
  enabled: boolean;
}

/** Payment methods offered by the store. No transaction is processed in demo mode. */
export const paymentMethods: PaymentMethodConfig[] = [
  {
    id: 'pix',
    label: 'Pix',
    description: 'O código Pix é gerado pelo provedor de pagamento após a confirmação.',
    enabled: true,
  },
  {
    id: 'cartao-entrega',
    label: 'Cartão na entrega',
    description: 'Crédito ou débito na maquininha, na entrega ou na retirada.',
    enabled: true,
  },
  {
    id: 'dinheiro',
    label: 'Dinheiro',
    description: 'Pague na entrega ou na retirada. Informe se precisa de troco.',
    enabled: true,
  },
];

export type BenefitIcon = 'delivery' | 'quality' | 'offers' | 'secure';

export interface Benefit {
  id: string;
  icon: BenefitIcon;
  title: string;
  subtitle: string;
}

/** Service promises shown on the home page. Validate before using in production. */
export const benefits: Benefit[] = [
  { id: 'entrega', icon: 'delivery', title: 'Entrega rápida', subtitle: store.delivery.estimate.replace('min', 'minutos') },
  { id: 'qualidade', icon: 'quality', title: 'Melhor qualidade', subtitle: 'Sempre fresquinho' },
  { id: 'ofertas', icon: 'offers', title: 'Ofertas especiais', subtitle: 'Todos os dias' },
  { id: 'pagamento', icon: 'secure', title: 'Pagamento seguro', subtitle: 'Compra protegida' },
];

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

/** No notification source exists yet. Plug the backend feed in here. */
export const notifications: AppNotification[] = [];
