import { Heart } from 'lucide-react';
import { ProductGrid } from '../components/catalog/ProductSection';
import { PageHeader } from '../components/layout/Header';
import { ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useFavorites } from '../hooks/useFavorites';
import { getProduct } from '../themes';
import type { Product } from '../types';

export function Favorites() {
  const { ids } = useFavorites();
  const favorites = ids.map((id) => getProduct(id)).filter((product): product is Product => Boolean(product?.available));

  return (
    <>
      <PageHeader title="Favoritos" />
      <div className="px-4 pt-2 lg:px-0">
        {favorites.length === 0 ? (
          <EmptyState icon={Heart} title="Nenhum favorito ainda" actions={<ButtonLink to="/cardapio">Ver cardápio</ButtonLink>}>
            Toque no coração de um produto para guardar aqui e pedir de novo mais rápido.
          </EmptyState>
        ) : (
          <>
            <p className="mb-3 text-[14px] text-ink-2">Toque no coração para tirar um produto dos favoritos.</p>
            <ProductGrid products={favorites} />
          </>
        )}
      </div>
    </>
  );
}
