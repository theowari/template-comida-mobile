import type { ThemeId } from '../themes/types';

/** Prices are always integers in centavos (R$ 42,90 = 4290). */
export type Cents = number;

export interface ResponsiveImage {
  src: string;
  srcSet?: string;
  alt: string;
}

/**
 * Each theme defines its own categories. 'combos' is shared by every theme
 * (Ofertas lists it); an id used by two themes must keep the same name.
 */
export type CategoryId = string;

/** A category id, or 'todas' for the whole catalog. */
export type CategoryFilter = CategoryId;

export interface Category {
  id: CategoryFilter;
  name: string;
  image: ResponsiveImage;
  /** Hidden from the category rail (still a section in the menu). */
  hiddenFromRail?: boolean;
}

export interface OptionChoice {
  id: string;
  name: string;
  description?: string;
  /** Added to the unit price when chosen. 0 = free. */
  priceDelta: Cents;
}

export type OptionKind = 'size' | 'flavor' | 'crust' | 'border' | 'extra' | 'remove' | 'choice';

export interface OptionGroup {
  id: string;
  kind: OptionKind;
  title: string;
  description?: string;
  /** min > 0 means the group must be answered. */
  min: number;
  max: number;
  choices: OptionChoice[];
  /** Preselected choices. A required group with defaults is already answered. */
  defaultChoiceIds?: string[];
}

export type ProductBadge = 'mais-vendido' | 'popular' | 'novidade';

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: CategoryId;
  basePrice: Cents;
  /** Original price for combos and promotions (shown struck through). */
  compareAtPrice?: Cents;
  image: ResponsiveImage;
  badge?: ProductBadge;
  /** Demo rating. Never show it as a real rating. */
  rating?: { value: number; isDemo: true };
  /** Demo ranking used by "Mais pedidos" sorting. Not real sales data. */
  popularity: number;
  /** Shown in the "Mais pedidos" section on the home page. */
  featured?: boolean;
  serves?: string;
  available: boolean;
  /** Extra search keywords. */
  tags?: string[];
  optionGroups?: OptionGroup[];
}

/** groupId -> chosen choice ids */
export type Selections = Record<string, string[]>;

export interface CartItem {
  lineId: string;
  productId: string;
  selections: Selections;
  notes: string;
  quantity: number;
}

export type PriceRange = 'ate-20' | '20-40' | 'acima-40';
export type SortOption = 'relevancia' | 'menor-preco' | 'maior-preco' | 'mais-pedidos';

export interface CatalogFilters {
  query: string;
  category: CategoryFilter;
  priceRange: PriceRange | null;
  sort: SortOption;
}

export type CouponKind = 'percent' | 'free-delivery';

export interface Coupon {
  code: string;
  kind: CouponKind;
  /** percent: 10 = 10% */
  value: number;
  maxDiscount?: Cents;
  minSubtotal: Cents;
  description: string;
  isDemo: true;
}

export type FulfillmentMode = 'entrega' | 'retirada';
export type PaymentMethodId = 'pix' | 'cartao-entrega' | 'dinheiro';

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  reference: string;
}

export interface PaymentChoice {
  method: PaymentMethodId | null;
  needsChange: boolean;
  /** Cash amount the customer will pay with, in centavos. */
  changeFor: Cents | null;
}

export interface CheckoutDraft {
  customer: CustomerInfo;
  mode: FulfillmentMode;
  address: Address;
  payment: PaymentChoice;
}

export interface OrderTotals {
  subtotal: Cents;
  deliveryFee: Cents;
  discount: Cents;
  total: Cents;
}

export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: Cents;
  lineTotal: Cents;
  details: string[];
  notes: string;
}

export type OrderStatus = 'recebido' | 'em-preparo' | 'a-caminho' | 'pronto-para-retirada' | 'entregue' | 'cancelado';

export interface Order {
  id: string;
  createdAt: string;
  /** Theme (brand) the order was placed in. Orders saved before themes existed are Pizzaria. */
  theme?: ThemeId;
  /** 'demo' orders were never sent to a store. */
  source: 'demo' | 'api';
  status: OrderStatus | null;
  customer: CustomerInfo;
  mode: FulfillmentMode;
  address: Address | null;
  payment: PaymentChoice;
  lines: OrderLine[];
  totals: OrderTotals;
  couponCode: string | null;
}
