import { readStorage, storageKeys, writeStorage } from '../lib/storage';
import type { Order } from '../types';

export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'source' | 'status'>;

/**
 * Contract for the order backend. Swap `orderService` for an HTTP
 * implementation (POST /orders, GET /orders, GET /orders/:id) when it exists.
 */
export interface OrderService {
  readonly isDemo: boolean;
  createOrder(input: NewOrder): Promise<Order>;
  listOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
}

const isOrderList = (value: unknown): value is Order[] => Array.isArray(value);

function shortCode(existing: Order[]): string {
  const taken = new Set(existing.map((order) => order.id));
  let code = '';
  do {
    code = String(Math.floor(1000 + Math.random() * 9000));
  } while (taken.has(code));
  return code;
}

/**
 * DEMO: stores orders only in this browser. Nothing is sent to the store,
 * no payment is processed and there is no real status tracking.
 */
const demoOrderService: OrderService = {
  isDemo: true,

  async createOrder(input) {
    const orders = readStorage<Order[]>(storageKeys.orders, [], isOrderList);
    const order: Order = {
      ...input,
      id: shortCode(orders),
      createdAt: new Date().toISOString(),
      source: 'demo',
      status: null,
    };
    // Short wait so the confirm button shows its loading state like a real request.
    await new Promise((resolve) => setTimeout(resolve, 700));
    writeStorage(storageKeys.orders, [order, ...orders].slice(0, 20));
    return order;
  },

  async listOrders() {
    return readStorage<Order[]>(storageKeys.orders, [], isOrderList);
  },

  async getOrder(id) {
    return readStorage<Order[]>(storageKeys.orders, [], isOrderList).find((order) => order.id === id) ?? null;
  },
};

export const orderService: OrderService = demoOrderService;
