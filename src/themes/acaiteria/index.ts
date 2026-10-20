import { IceCreamBowl } from 'lucide-react';
import { comboDiscountPercent } from '../catalog';
import type { ThemeDefinition } from '../types';
import { categories, menuSectionOrder } from './categories';
import { image } from './images';
import { featuredProductIds, products } from './products';

const comboDiscount = comboDiscountPercent(products);

export const acaiteria: ThemeDefinition = {
  id: 'acaiteria',
  label: 'Açaíteria',
  swatches: { brand: '#6b2bb5', oven: '#26093a', ground: '#f6f2fb' },
  fonts: ['400 16px "Onest Variable"', '800 16px "Bricolage Grotesque Variable"'],
  brand: {
    name: ['Roxo', 'Açaí'],
    tagline: 'Açaí cremoso e geladinho.',
    segment: 'Açaí, bowls e smoothies',
    description: 'Roxo Açaí: tigelas, copos, bowls, smoothies e bebidas com entrega ou retirada.',
    homeHeading: 'açaí, bowls, smoothies e bebidas com entrega ou retirada',
    searchPlaceholder: 'Busque seu açaí favorito...',
    notesPlaceholder: 'Ex.: granola à parte, pouco leite condensado',
    openingHours: 'Todos os dias, das 11h às 22h',
    greetingIcon: IceCreamBowl,
    mark: 'bowl',
  },
  catalog: { products, categories, menuSectionOrder, featuredProductIds },
  heroSlides: [
    {
      id: 'do-seu-jeito',
      badge: 'Monte o seu',
      titleLines: ['Açaí cremoso,', 'do seu jeito.'],
      description: 'Escolha o tamanho, as frutas e os complementos.',
      cta: 'Pedir agora',
      target: { kind: 'category', category: 'acai' },
      image: image('hero-tigela', 'Tigela de açaí com morangos, laranja e flores comestíveis'),
      focus: '50% 50%',
    },
    {
      id: 'combos',
      badge: 'Para dividir',
      titleLines: ['Chama a galera', 'pro açaí.'],
      description: 'Combos para a dupla e para a galera toda.',
      cta: 'Ver combos',
      target: { kind: 'route', to: '/ofertas#combos' },
      image: image('hero-bowl', 'Bowl de açaí cremoso com morangos e granola'),
      focus: '50% 50%',
    },
    {
      id: 'smoothies',
      badge: 'Geladinho',
      titleLines: ['Smoothies', 'que refrescam.'],
      description: 'Açaí, frutas e gelo batidos na hora.',
      cta: 'Ver smoothies',
      target: { kind: 'category', category: 'smoothies' },
      image: image('hero-smoothie', 'Smoothie roxo em pote de vidro com frutas caindo'),
      focus: '50% 50%',
    },
  ],
  comboBanner: {
    badge: 'Combos exclusivos',
    title: `Até ${comboDiscount}% de desconto`,
    description: 'Tigelas para a dupla ou para a galera toda.',
    cta: 'Pedir agora',
    to: '/ofertas#combos',
    sticker: `${comboDiscount}%`,
    image: image('banner-combo', 'Tigela de açaí com frutas vermelhas, banana e granola'),
    focus: '50% 50%',
  },
};
