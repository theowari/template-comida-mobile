import { SearchX } from 'lucide-react';
import { ActiveFilters } from '../components/catalog/ActiveFilters';
import { CategoryList } from '../components/catalog/CategoryList';
import { ProductGrid, ProductSection } from '../components/catalog/ProductSection';
import { SearchBar } from '../components/catalog/SearchBar';
import { DemoFootnote } from '../components/home/DemoFootnote';
import { PageHeader } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useCatalogFilters } from '../hooks/useCatalogFilters';
import { useTheme } from '../hooks/useTheme';
import { isRefining } from '../lib/catalog';
import { pluralize } from '../lib/format';
import { categoryName } from '../themes';

export function Menu() {
  const { filters, results, resetFilters } = useCatalogFilters();
  const { theme } = useTheme();
  const refining = isRefining(filters);

  const sections = theme.catalog.menuSectionOrder
    .map((categoryId) => ({ categoryId, items: results.filter((product) => product.categoryId === categoryId) }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      <PageHeader title="Cardápio" />

      <div className="sticky top-0 z-30 space-y-2 bg-ground px-4 pt-2 pb-2 lg:top-[76px] lg:px-0 lg:pt-3">
        <SearchBar className="lg:hidden" />
        <CategoryList variant="chips" />
        <ActiveFilters />
      </div>

      <div className="space-y-8 px-4 pt-3 lg:px-0 lg:pt-5">
        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Não encontramos esse produto."
            actions={
              <Button variant="secondary" onClick={resetFilters}>
                Limpar busca e filtros
              </Button>
            }
          >
            Que tal explorar outras opções? Tente outro nome ou outra categoria.
          </EmptyState>
        ) : refining ? (
          <ProductSection
            id="resultados"
            title={filters.query.trim() ? `Resultados para “${filters.query.trim()}”` : 'Resultados'}
            aside={
              <p className="mt-0.5 text-[13px] text-ink-2" aria-live="polite">
                {pluralize(results.length, 'produto encontrado', 'produtos encontrados')}
              </p>
            }
          >
            <ProductGrid products={results} mobileLayout="row" priorityCount={3} />
          </ProductSection>
        ) : (
          sections.map((section, index) => (
            // Keyed by position: on a theme change the sections stay and their photos crossfade.
            <ProductSection key={index} id={`secao-${section.categoryId}`} title={categoryName(section.categoryId)}>
              <ProductGrid products={section.items} mobileLayout="row" priorityCount={index === 0 ? 3 : 0} slotKeys />
            </ProductSection>
          ))
        )}
        <DemoFootnote />
      </div>
    </>
  );
}
