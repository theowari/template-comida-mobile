import { CakeSlice } from 'lucide-react';
import { comboDiscountPercent } from '../catalog';
import type { ThemeDefinition } from '../types';
import { categories, menuSectionOrder } from './categories';
import { image } from './images';
import { featuredProductIds, products } from './products';

const comboDiscount = comboDiscountPercent(products);

export const confeitaria: ThemeDefinition = {
  id: 'confeitaria',
  label: 'Confeitaria',
  swatches: { brand: '#ad3f6c', oven: '#3f1a28', ground: '#fcf5f2' },
  fonts: ['400 16px "Figtree Variable"', '600 16px "Bodoni Moda Variable"', 'italic 600 16px "Bodoni Moda Variable"'],
  brand: {
    name: ['Ateliê', 'Doce'],
    tagline: 'Feito à mão, todos os dias.',
    segment: 'Confeitaria e encomendas',
    description: 'Ateliê Doce: bolos, tortas, docinhos, cupcakes e bebidas com entrega ou retirada.',
    homeHeading: 'bolos, tortas, docinhos e bebidas com entrega ou retirada',
    searchPlaceholder: 'Busque seu doce favorito...',
    notesPlaceholder: 'Ex.: escrever “Parabéns, Ana” no bolo',
    openingHours: 'Terça a domingo, das 10h às 19h',
    greetingIcon: CakeSlice,
    mark: 'cupcake',
  },
  catalog: { products, categories, menuSectionOrder, featuredProductIds },
  heroSlides: [
    {
      id: 'feito-a-mao',
      badge: 'Feito à mão',
      titleLines: ['Doces que', 'abraçam.'],
      description: 'Bolos, tortas e docinhos preparados todos os dias.',
      cta: 'Pedir agora',
      target: { kind: 'category', category: 'bolos' },
      image: image('hero-encomenda', 'Bolo decorado com morangos frescos e flores'),
      focus: '50% 45%',
    },
    {
      id: 'presentes',
      badge: 'Para presentear',
      titleLines: ['Uma caixinha', 'de carinho.'],
      description: 'Caixas com macarons, brigadeiros e cupcakes.',
      cta: 'Ver combos',
      target: { kind: 'route', to: '/ofertas#combos' },
      image: image('hero-macarons', 'Macarons coloridos sobre fundo cor-de-rosa'),
      focus: '50% 50%',
    },
    {
      id: 'tortas',
      badge: 'Tortas',
      titleLines: ['Uma fatia', 'de alegria.'],
      description: 'Limão, morango e cheesecake de frutas vermelhas.',
      cta: 'Ver tortas',
      target: { kind: 'category', category: 'tortas' },
      image: image('hero-vitrine', 'Vitrine de confeitaria com tortas de frutas e bolos'),
      focus: '50% 50%',
    },
  ],
  comboBanner: {
    badge: 'Combos exclusivos',
    title: `Até ${comboDiscount}% de desconto`,
    description: 'Caixas de presente e café da tarde a dois.',
    cta: 'Pedir agora',
    to: '/ofertas#combos',
    sticker: `${comboDiscount}%`,
    image: image('banner-combo', 'Tortinhas de frutas e de limão com merengue lado a lado'),
    focus: '45% 50%',
  },
};
