import type { OptionGroup, Product } from '../../types';
import { image } from './images';

/*
 * DEMO CATALOG (Confeitaria). Names, descriptions and prices are demonstrative.
 * Ratings, badges and popularity are not real sales or review data.
 */

function cakeSizes(miniDelta: number, wholeDelta: number): OptionGroup {
  return {
    id: 'tamanho',
    kind: 'size',
    title: 'Escolha o tamanho',
    min: 1,
    max: 1,
    choices: [
      { id: 'fatia', name: 'Fatia', description: 'Cerca de 150 g', priceDelta: 0 },
      { id: 'mini', name: 'Mini bolo', description: '600 g · serve 4 a 6 pessoas', priceDelta: miniDelta },
      { id: 'inteiro', name: 'Bolo inteiro', description: '1,5 kg · serve 12 a 15 pessoas', priceDelta: wholeDelta },
    ],
  };
}

const partyExtras: OptionGroup = {
  id: 'festa',
  kind: 'extra',
  title: 'Para a festa',
  description: 'Opcional. Escolha até 2.',
  min: 0,
  max: 2,
  choices: [
    { id: 'vela', name: 'Vela de aniversário', priceDelta: 400 },
    { id: 'topo', name: 'Topo de bolo com nome', priceDelta: 1500 },
  ],
};

function tartSizes(wholeDelta: number): OptionGroup {
  return {
    id: 'tamanho',
    kind: 'size',
    title: 'Escolha o tamanho',
    min: 1,
    max: 1,
    choices: [
      { id: 'fatia', name: 'Fatia', description: 'Cerca de 130 g', priceDelta: 0 },
      { id: 'inteira', name: 'Torta inteira', description: '24 cm · serve 10 pessoas', priceDelta: wholeDelta },
    ],
  };
}

export const products: Product[] = [
  // Combos
  {
    id: 'caixa-presente',
    name: 'Caixa Presente',
    description: '6 macarons, 6 brigadeiros gourmet e 2 cupcakes em caixa de presente.',
    categoryId: 'combos',
    basePrice: 6490,
    compareAtPrice: 8220,
    image: image('caixa-presente', 'Caixas de presente com cupcakes sortidos'),
    popularity: 74,
    serves: 'Serve 3 a 4 pessoas',
    available: true,
    tags: ['combo', 'promoção', 'presente', 'caixa'],
    optionGroups: [
      {
        id: 'cupcakes',
        kind: 'choice',
        title: 'Sabor dos 2 cupcakes',
        min: 1,
        max: 1,
        choices: [
          { id: 'morango', name: 'Morango', priceDelta: 0 },
          { id: 'chocolate', name: 'Chocolate', priceDelta: 0 },
          { id: 'um-de-cada', name: 'Um de cada', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'cafe-da-tarde',
    name: 'Café da Tarde a Dois',
    description: '2 fatias de bolo do mesmo sabor e 2 chocolates quentes.',
    categoryId: 'combos',
    basePrice: 4490,
    compareAtPrice: 6160,
    image: image('cafe-da-tarde', 'Fatia de bolo com cobertura rosa, suspiros e xícara de café'),
    popularity: 71,
    serves: 'Serve 2 pessoas',
    available: true,
    tags: ['combo', 'promoção', 'dois', 'casal', 'chocolate quente'],
    optionGroups: [
      {
        id: 'bolo',
        kind: 'flavor',
        title: 'Bolo das 2 fatias',
        min: 1,
        max: 1,
        choices: [
          { id: 'bolo-red-velvet', name: 'Red Velvet', priceDelta: 0 },
          { id: 'bolo-cenoura', name: 'Cenoura com brigadeiro', priceDelta: 0 },
          { id: 'naked-cake', name: 'Naked de frutas vermelhas', priceDelta: 0 },
        ],
      },
    ],
  },

  // Bolos
  {
    id: 'bolo-red-velvet',
    name: 'Bolo Red Velvet',
    description: 'Massa aveludada de cacau com recheio e cobertura de cream cheese.',
    categoryId: 'bolos',
    basePrice: 1690,
    image: image('bolo-red-velvet', 'Fatia alta de red velvet com morangos frescos'),
    badge: 'mais-vendido',
    rating: { value: 4.9, isDemo: true },
    popularity: 97,
    featured: true,
    available: true,
    tags: ['bolo', 'red velvet', 'cream cheese', 'aniversário'],
    optionGroups: [cakeSizes(4900, 12300), partyExtras],
  },
  {
    id: 'bolo-cenoura',
    name: 'Bolo de Cenoura',
    description: 'Clássico fofinho com cobertura generosa de brigadeiro.',
    categoryId: 'bolos',
    basePrice: 1290,
    image: image('bolo-cenoura', 'Bolo de cenoura com cobertura de chocolate cortado'),
    badge: 'popular',
    rating: { value: 4.8, isDemo: true },
    popularity: 93,
    featured: true,
    available: true,
    tags: ['bolo', 'cenoura', 'brigadeiro', 'chocolate'],
    optionGroups: [cakeSizes(3700, 8600), partyExtras],
  },
  {
    id: 'naked-cake',
    name: 'Naked Cake de Frutas',
    description: 'Massa de baunilha, creme de mascarpone e frutas vermelhas frescas.',
    categoryId: 'bolos',
    basePrice: 1790,
    image: image('naked-cake', 'Naked cake coberto de frutas vermelhas'),
    badge: 'novidade',
    rating: { value: 4.7, isDemo: true },
    popularity: 80,
    featured: true,
    available: true,
    tags: ['bolo', 'naked', 'frutas vermelhas', 'morango', 'aniversário'],
    optionGroups: [cakeSizes(5200, 13200), partyExtras],
  },

  // Tortas
  {
    id: 'torta-limao',
    name: 'Torta de Limão',
    description: 'Base amanteigada, creme de limão siciliano e merengue maçaricado.',
    categoryId: 'tortas',
    basePrice: 1490,
    image: image('torta-limao', 'Torta de limão inteira com merengue maçaricado'),
    popularity: 88,
    featured: true,
    available: true,
    tags: ['torta', 'limão', 'merengue'],
    optionGroups: [tartSizes(7500)],
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake de Frutas Vermelhas',
    description: 'Cheesecake cremoso com calda caseira de frutas vermelhas.',
    categoryId: 'tortas',
    basePrice: 1690,
    image: image('cheesecake', 'Fatia de cheesecake com calda de frutas vermelhas'),
    popularity: 76,
    available: true,
    tags: ['torta', 'cheesecake', 'frutas vermelhas'],
    optionGroups: [tartSizes(9300)],
  },
  {
    id: 'torta-morango',
    name: 'Torta de Morango',
    description: 'Creme de baunilha e morangos frescos sobre massa crocante.',
    categoryId: 'tortas',
    basePrice: 1590,
    image: image('torta-morango', 'Torta coberta de morangos frescos'),
    popularity: 70,
    available: true,
    tags: ['torta', 'morango'],
    optionGroups: [tartSizes(8400)],
  },

  // Docinhos
  {
    id: 'macarons',
    name: 'Macarons Sortidos',
    description: 'Casquinha crocante e recheio cremoso nos sabores da semana.',
    categoryId: 'docinhos',
    basePrice: 3990,
    image: image('macarons', 'Pilha de macarons em tons pastel'),
    popularity: 85,
    featured: true,
    available: true,
    tags: ['macaron', 'doce', 'presente'],
    optionGroups: [
      {
        id: 'caixa',
        kind: 'size',
        title: 'Tamanho da caixa',
        min: 1,
        max: 1,
        defaultChoiceIds: ['caixa-6'],
        choices: [
          { id: 'caixa-6', name: 'Caixa com 6', priceDelta: 0 },
          { id: 'caixa-12', name: 'Caixa com 12', priceDelta: 3500 },
        ],
      },
    ],
  },
  {
    id: 'brigadeiros',
    name: 'Brigadeiros Gourmet',
    description: 'Chocolate belga e granulado crocante. Caixa com 12.',
    categoryId: 'docinhos',
    basePrice: 3290,
    image: image('brigadeiros', 'Brigadeiros de chocolate em forminhas'),
    popularity: 90,
    featured: true,
    available: true,
    tags: ['brigadeiro', 'docinho', 'chocolate', 'festa'],
    optionGroups: [
      {
        id: 'sabores',
        kind: 'choice',
        title: 'Sabores',
        min: 1,
        max: 1,
        defaultChoiceIds: ['tradicional'],
        choices: [
          { id: 'tradicional', name: 'Só tradicional', priceDelta: 0 },
          { id: 'sortidos', name: 'Sortidos', description: 'Tradicional, branco e pistache', priceDelta: 600 },
        ],
      },
    ],
  },

  // Cupcakes
  {
    id: 'cupcake-morango',
    name: 'Cupcake de Morango',
    description: 'Massa de baunilha e cobertura de creme de morango.',
    categoryId: 'cupcakes',
    basePrice: 1290,
    image: image('cupcake-morango', 'Cupcakes com cobertura cor-de-rosa'),
    popularity: 66,
    available: true,
    tags: ['cupcake', 'morango', 'baunilha'],
  },
  {
    id: 'cupcake-chocolate',
    name: 'Cupcake de Chocolate',
    description: 'Massa de cacau, ganache e confeitos de chocolate.',
    categoryId: 'cupcakes',
    basePrice: 1290,
    image: image('cupcake-chocolate', 'Cupcake de chocolate com cobertura cremosa'),
    popularity: 62,
    available: true,
    tags: ['cupcake', 'chocolate'],
  },

  // Bebidas
  {
    id: 'chocolate-quente',
    name: 'Chocolate Quente',
    description: 'Chocolate meio amargo cremoso, 300 ml.',
    categoryId: 'bebidas',
    basePrice: 1490,
    image: image('chocolate-quente', 'Xícara de chocolate quente cremoso'),
    popularity: 58,
    available: true,
    tags: ['chocolate', 'quente', 'bebida'],
    optionGroups: [
      {
        id: 'adicionais',
        kind: 'extra',
        title: 'Adicionais',
        description: 'Opcional. Escolha até 2.',
        min: 0,
        max: 2,
        choices: [
          { id: 'chantilly', name: 'Chantilly', priceDelta: 300 },
          { id: 'marshmallow', name: 'Marshmallow', priceDelta: 300 },
        ],
      },
    ],
  },
  {
    id: 'limonada-rosa',
    name: 'Limonada Rosa',
    description: 'Limão, frutas vermelhas e hortelã, 400 ml.',
    categoryId: 'bebidas',
    basePrice: 1190,
    image: image('limonada-rosa', 'Copos de limonada rosa com gelo'),
    popularity: 52,
    available: true,
    tags: ['limonada', 'suco', 'frutas vermelhas', 'bebida'],
  },
];

/** "Mais pedidos", in order. */
export const featuredProductIds = [
  'bolo-red-velvet',
  'bolo-cenoura',
  'naked-cake',
  'torta-limao',
  'macarons',
  'brigadeiros',
];
