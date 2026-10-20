import { Coffee } from 'lucide-react';
import { comboDiscountPercent } from '../catalog';
import type { ThemeDefinition } from '../types';
import { categories, menuSectionOrder } from './categories';
import { image } from './images';
import { featuredProductIds, products } from './products';

const comboDiscount = comboDiscountPercent(products);

export const cafeteria: ThemeDefinition = {
  id: 'cafeteria',
  label: 'Cafeteria',
  swatches: { brand: '#9a5222', oven: '#2b1b12', ground: '#f3ece3' },
  fonts: ['400 16px "Hanken Grotesk Variable"', '800 16px "Besley Variable"'],
  brand: {
    name: ['Grão', '& Prosa'],
    tagline: 'Café especial, sem pressa.',
    segment: 'Cafés especiais e delivery',
    description: 'Grão & Prosa: cafés especiais, gelados, salgados, doces e grãos com entrega ou retirada.',
    homeHeading: 'cafés, gelados, salgados, doces e grãos com entrega ou retirada',
    searchPlaceholder: 'Busque seu café favorito...',
    notesPlaceholder: 'Ex.: leite bem quente, sem açúcar',
    openingHours: 'Segunda a sábado, das 7h às 20h',
    greetingIcon: Coffee,
    mark: 'bean',
  },
  catalog: { products, categories, menuSectionOrder, featuredProductIds },
  heroSlides: [
    {
      id: 'feito-na-hora',
      badge: 'Feito na hora',
      titleLines: ['Seu café,', 'do seu jeito.'],
      description: 'Espressos e cafés com leite preparados por baristas.',
      cta: 'Pedir agora',
      target: { kind: 'category', category: 'cafes' },
      image: image('hero-latte-art', 'Barista desenhando no leite de um cappuccino'),
      focus: '50% 50%',
    },
    {
      id: 'combos',
      badge: 'Para dividir',
      titleLines: ['Café e prosa', 'num combo só.'],
      description: 'Café da manhã e café a dois com preço especial.',
      cta: 'Ver combos',
      target: { kind: 'route', to: '/ofertas#combos' },
      image: image('hero-ambiente', 'Salão aconchegante de cafeteria com mesas de madeira e sofá de couro'),
      focus: '50% 50%',
    },
    {
      id: 'graos',
      badge: 'Grãos especiais',
      titleLines: ['Leve o café', 'para casa.'],
      description: 'Grãos moídos na hora para coado, prensa ou espresso.',
      cta: 'Ver grãos',
      target: { kind: 'category', category: 'graos' },
      image: image('hero-metodos', 'Café sendo coado em uma bancada com coadores e jarras'),
      focus: '50% 50%',
    },
  ],
  comboBanner: {
    badge: 'Combos exclusivos',
    title: `Até ${comboDiscount}% de desconto`,
    description: 'Café da manhã e café a dois com preço especial.',
    cta: 'Pedir agora',
    to: '/ofertas#combos',
    sticker: `${comboDiscount}%`,
    image: image('banner-combo', 'Cappuccino ao lado de um croissant em mesa de madeira'),
    focus: '45% 50%',
  },
};
