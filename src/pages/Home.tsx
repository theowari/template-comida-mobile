import { SearchX } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ActiveFilters } from '../components/catalog/ActiveFilters';
import { CategoryList } from '../components/catalog/CategoryList';
import { ProductGrid, ProductSection } from '../components/catalog/ProductSection';
import { SearchBar } from '../components/catalog/SearchBar';
import { BenefitsSection } from '../components/home/BenefitsSection';
import { ComboBanner } from '../components/home/ComboBanner';
import { DeliveryInfo } from '../components/home/DeliveryInfo';
import { DemoFootnote } from '../components/home/DemoFootnote';
import { HeroBanner } from '../components/home/HeroBanner';
import { HomeHeader } from '../components/layout/Header';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { categoryName } from '../data/categories';
import { featuredProductIds, getProduct } from '../data/products';
import { heroSlides, type HeroSlide } from '../data/promotions';
import { store } from '../data/store';
import { useCatalogFilters } from '../hooks/useCatalogFilters';
import { isRefining } from '../lib/catalog';
import { pluralize } from '../lib/format';
import type { Product } from '../types';

const featured = featuredProductIds.map((id) => getProduct(id)).filter((product): product is Product => Boolean(product?.available));

function scrollToProducts() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() =>
    document.getElementById('produtos')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }),
  );
}

export function Home() {
  const { filters, results, setFilters, resetFilters } = useCatalogFilters();
  const navigate = useNavigate();
  const refining = isRefining(filters);

  const onHeroAction = (slide: HeroSlide) => {
    if (slide.target.kind === 'route') {
      navigate(slide.target.to);
      return;
    }
    setFilters({ category: slide.target.category });
    scrollToProducts();
  };

  return (
    <>
      <h1 className="sr-only">{store.name}: pizzas, lanches e bebidas com entrega ou retirada</h1>
      <HomeHeader />

      <div className="sticky top-0 z-30 bg-ground px-4 pt-2 pb-2 lg:hidden">
        <SearchBar />
      </div>

      <div className="space-y-5 px-4 lg:space-y-8 lg:px-0 lg:pt-6">
        <div className="space-y-2">
          <DeliveryInfo />
          <ActiveFilters />
        </div>

        {!refining ? <HeroBanner slides={heroSlides} onAction={onHeroAction} /> : null}

        <CategoryList />

        {refining ? (
          <ProductSection
            id="produtos"
            title={filters.query.trim() ? `Resultados para “${filters.query.trim()}”` : 'Resultados'}
            aside={
              <p className="mt-0.5 text-[13px] text-ink-2" aria-live="polite">
                {pluralize(results.length, 'produto encontrado', 'produtos encontrados')}
              </p>
            }
          >
            {results.length > 0 ? (
              <ProductGrid products={results} />
            ) : (
              <>
                <EmptyState
                  icon={SearchX}
                  title="Não encontramos esse produto."
                  actions={
                    <>
                      <Button variant="secondary" onClick={resetFilters}>
                        Limpar busca e filtros
                      </Button>
                      <ButtonLink to="/cardapio" onClick={resetFilters}>
                        Ver cardápio completo
                      </ButtonLink>
                    </>
                  }
                >
                  Que tal explorar outras opções? Confira os mais pedidos abaixo.
                </EmptyState>
                <ProductSection title="Mais pedidos" titleId="sugestoes-titulo" className="mt-2">
                  <ProductGrid products={featured} columns={3} />
                </ProductSection>
              </>
            )}
          </ProductSection>
        ) : filters.category === 'todas' ? (
          <ProductSection id="produtos" title="Mais pedidos" link={{ to: '/cardapio', label: 'Ver todos' }}>
            <ProductGrid products={featured} columns={3} priorityCount={2} />
          </ProductSection>
        ) : (
          <ProductSection
            id="produtos"
            title={categoryName(filters.category)}
            link={{ to: '/cardapio', label: 'Ver cardápio' }}
            aside={<p className="mt-0.5 text-[13px] text-ink-2">{pluralize(results.length, 'opção', 'opções')}</p>}
          >
            <ProductGrid products={results} columns={3} />
          </ProductSection>
        )}

        {!refining ? (
          <>
            <ComboBanner />
            <BenefitsSection />
          </>
        ) : null}

        <DemoFootnote className="pt-2" />
      </div>
    </>
  );
}
