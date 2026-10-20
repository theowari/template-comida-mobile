import { Heart, House, LayoutGrid, ReceiptText, Tag, User, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** The raised red center item of the bottom bar. */
  featured?: boolean;
}

/** Bottom bar (phones) and top nav (desktop) share this list and order. */
export const primaryNav: NavItem[] = [
  { to: '/', label: 'Início', icon: House },
  { to: '/cardapio', label: 'Cardápio', icon: LayoutGrid },
  { to: '/pedidos', label: 'Pedidos', icon: ReceiptText, featured: true },
  { to: '/ofertas', label: 'Ofertas', icon: Tag },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export const drawerNav: NavItem[] = [
  ...primaryNav.slice(0, 2),
  { to: '/ofertas', label: 'Ofertas e cupons', icon: Tag },
  { to: '/pedidos', label: 'Meus pedidos', icon: ReceiptText },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/perfil', label: 'Perfil', icon: User },
];
