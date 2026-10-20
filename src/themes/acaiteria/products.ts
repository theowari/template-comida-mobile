import type { OptionGroup, Product } from '../../types';
import { image } from './images';

/*
 * DEMO CATALOG (Açaíteria). Names, descriptions and prices are demonstrative.
 * Ratings, badges and popularity are not real sales or review data.
 */

const bowlSizes: OptionGroup = {
  id: 'tamanho',
  kind: 'size',
  title: 'Escolha o tamanho',
  min: 1,
  max: 1,
  choices: [
    { id: '300ml', name: '300 ml', priceDelta: 0 },
    { id: '500ml', name: '500 ml', priceDelta: 700 },
    { id: '700ml', name: '700 ml', priceDelta: 1300 },
  ],
};

const toppings: OptionGroup = {
  id: 'complementos',
  kind: 'extra',
  title: 'Complementos',
  description: 'Escolha até 3.',
  min: 0,
  max: 3,
  choices: [
    { id: 'leite-em-po', name: 'Leite em pó', priceDelta: 200 },
    { id: 'pacoca', name: 'Paçoca', priceDelta: 200 },
    { id: 'leite-condensado', name: 'Leite condensado', priceDelta: 200 },
    { id: 'granola-extra', name: 'Granola extra', priceDelta: 200 },
    { id: 'morango', name: 'Morango', priceDelta: 300 },
    { id: 'creme-de-avela', name: 'Creme de avelã', priceDelta: 400 },
  ],
};

export const products: Product[] = [
  // Combos
  {
    id: 'combo-dupla',
    name: 'Combo Dupla',
    description: '2 tigelas de 500 ml com banana, granola e um complemento à escolha.',
    categoryId: 'combos',
    basePrice: 3990,
    compareAtPrice: 5180,
    image: image('combo-dupla', 'Duas tigelas de açaí com banana, frutas vermelhas e granola'),
    popularity: 77,
    serves: 'Serve 2 pessoas',
    available: true,
    tags: ['combo', 'promoção', 'dois', 'dupla', 'tigela'],
    optionGroups: [
      {
        id: 'complemento',
        kind: 'choice',
        title: 'Complemento das tigelas',
        min: 1,
        max: 1,
        choices: [
          { id: 'leite-em-po', name: 'Leite em pó', priceDelta: 0 },
          { id: 'pacoca', name: 'Paçoca', priceDelta: 0 },
          { id: 'leite-condensado', name: 'Leite condensado', priceDelta: 0 },
          { id: 'morango', name: 'Morango', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'combo-galera',
    name: 'Combo Galera',
    description: '4 tigelas de 300 ml com banana e granola, mais 4 complementos para dividir.',
    categoryId: 'combos',
    basePrice: 5490,
    compareAtPrice: 7560,
    image: image('combo-galera', 'Mesa vista de cima com várias tigelas de açaí e frutas'),
    popularity: 72,
    serves: 'Serve 4 pessoas',
    available: true,
    tags: ['combo', 'promoção', 'família', 'galera', 'tigela'],
    optionGroups: [
      {
        id: 'base',
        kind: 'choice',
        title: 'Base das tigelas',
        min: 1,
        max: 1,
        choices: [
          { id: 'tradicional', name: 'Açaí tradicional', priceDelta: 0 },
          { id: 'zero', name: 'Açaí zero açúcar', priceDelta: 0 },
        ],
      },
    ],
  },

  // Açaí
  {
    id: 'acai-tradicional',
    name: 'Açaí Tradicional',
    description: 'Açaí cremoso com banana e granola crocante.',
    categoryId: 'acai',
    basePrice: 1690,
    image: image('acai-tradicional', 'Tigela de açaí com banana e granola'),
    badge: 'mais-vendido',
    rating: { value: 4.9, isDemo: true },
    popularity: 98,
    featured: true,
    available: true,
    tags: ['açaí', 'tigela', 'banana', 'granola'],
    optionGroups: [bowlSizes, toppings],
  },
  {
    id: 'acai-morango',
    name: 'Açaí com Morango',
    description: 'Morango fresco, banana, coco ralado e granola.',
    categoryId: 'acai',
    basePrice: 1990,
    image: image('acai-morango', 'Tigela de açaí com morangos, coco ralado e granola'),
    badge: 'popular',
    rating: { value: 4.8, isDemo: true },
    popularity: 90,
    featured: true,
    available: true,
    tags: ['açaí', 'tigela', 'morango', 'coco'],
    optionGroups: [bowlSizes, toppings],
  },

  // Copos
  {
    id: 'acai-copo',
    name: 'Açaí no Copo',
    description: 'Copo de 500 ml em camadas com mirtilo, coco e granola.',
    categoryId: 'copos',
    basePrice: 2190,
    image: image('acai-copo', 'Copo de açaí com mirtilos e coco ralado'),
    popularity: 80,
    featured: true,
    available: true,
    tags: ['açaí', 'copo', 'mirtilo', 'coco'],
    optionGroups: [toppings],
  },
  {
    id: 'copo-trufado',
    name: 'Copo Trufado',
    description: 'Açaí com creme de chocolate, morango e amora em camadas, 500 ml.',
    categoryId: 'copos',
    basePrice: 2490,
    image: image('copo-trufado', 'Copo de açaí com chocolate, morangos e amoras'),
    badge: 'novidade',
    rating: { value: 4.7, isDemo: true },
    popularity: 84,
    featured: true,
    available: true,
    tags: ['açaí', 'copo', 'chocolate', 'trufado', 'morango'],
  },

  // Bowls
  {
    id: 'bowl-tropical',
    name: 'Bowl Tropical',
    description: 'Açaí com manga, maracujá, pitaya, morango e mirtilo.',
    categoryId: 'bowls',
    basePrice: 2690,
    image: image('bowl-tropical', 'Bowl de açaí com maracujá, pitaya, morangos e mirtilos'),
    popularity: 78,
    featured: true,
    available: true,
    tags: ['bowl', 'açaí', 'frutas', 'maracujá', 'pitaya'],
  },
  {
    id: 'bowl-pitaya',
    name: 'Bowl de Pitaya',
    description: 'Creme de pitaya com frutas vermelhas, banana e granola.',
    categoryId: 'bowls',
    basePrice: 2590,
    image: image('bowl-pitaya', 'Bowl rosa de pitaya com frutas vermelhas e granola'),
    popularity: 66,
    available: true,
    tags: ['bowl', 'pitaya', 'frutas vermelhas'],
  },

  // Smoothies
  {
    id: 'smoothie-acai-banana',
    name: 'Smoothie de Açaí e Banana',
    description: 'Açaí batido com banana e leite, 400 ml.',
    categoryId: 'smoothies',
    basePrice: 1690,
    image: image('smoothie-acai-banana', 'Copo de smoothie roxo de açaí'),
    popularity: 74,
    featured: true,
    available: true,
    tags: ['smoothie', 'açaí', 'banana', 'vitamina'],
    optionGroups: [
      {
        id: 'leite',
        kind: 'choice',
        title: 'Leite',
        min: 1,
        max: 1,
        defaultChoiceIds: ['integral'],
        choices: [
          { id: 'integral', name: 'Integral', priceDelta: 0 },
          { id: 'aveia', name: 'Vegetal de aveia', priceDelta: 250 },
        ],
      },
    ],
  },
  {
    id: 'smoothie-morango',
    name: 'Smoothie de Morango',
    description: 'Morango, iogurte natural e mel, 400 ml.',
    categoryId: 'smoothies',
    basePrice: 1590,
    image: image('smoothie-morango', 'Smoothie de morango em copo com canudo'),
    popularity: 60,
    available: true,
    tags: ['smoothie', 'morango', 'iogurte', 'vitamina'],
  },

  // Bebidas
  {
    id: 'agua-de-coco',
    name: 'Água de Coco',
    description: 'Natural e bem gelada, 500 ml.',
    categoryId: 'bebidas',
    basePrice: 790,
    image: image('agua-de-coco', 'Coco verde com canudo sobre mesa de madeira'),
    popularity: 70,
    available: true,
    tags: ['coco', 'água de coco', 'bebida'],
  },
  {
    id: 'suco-verde',
    name: 'Suco Verde',
    description: 'Couve, maçã verde, limão e gengibre, 400 ml.',
    categoryId: 'bebidas',
    basePrice: 1190,
    image: image('suco-verde', 'Copo de suco verde com rodela de laranja'),
    popularity: 55,
    available: true,
    tags: ['suco', 'verde', 'detox', 'bebida'],
  },
];

/** "Mais pedidos", in order. */
export const featuredProductIds = [
  'acai-tradicional',
  'acai-morango',
  'copo-trufado',
  'bowl-tropical',
  'acai-copo',
  'smoothie-acai-banana',
];
