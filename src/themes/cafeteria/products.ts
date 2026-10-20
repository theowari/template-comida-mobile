import type { OptionGroup, Product } from '../../types';
import { image } from './images';

/*
 * DEMO CATALOG (Cafeteria). Names, descriptions and prices are demonstrative.
 * Ratings, badges and popularity are not real sales or review data.
 */

const cupSizes: OptionGroup = {
  id: 'tamanho',
  kind: 'size',
  title: 'Escolha o tamanho',
  min: 1,
  max: 1,
  choices: [
    { id: 'pequeno', name: 'Pequeno', description: '200 ml', priceDelta: 0 },
    { id: 'medio', name: 'Médio', description: '300 ml', priceDelta: 300 },
    { id: 'grande', name: 'Grande', description: '400 ml', priceDelta: 600 },
  ],
};

const milk: OptionGroup = {
  id: 'leite',
  kind: 'choice',
  title: 'Leite',
  min: 1,
  max: 1,
  defaultChoiceIds: ['integral'],
  choices: [
    { id: 'integral', name: 'Integral', priceDelta: 0 },
    { id: 'desnatado', name: 'Desnatado', priceDelta: 0 },
    { id: 'aveia', name: 'Vegetal de aveia', priceDelta: 250 },
  ],
};

const coffeeExtras: OptionGroup = {
  id: 'adicionais',
  kind: 'extra',
  title: 'Adicionais',
  description: 'Opcional. Escolha até 2.',
  min: 0,
  max: 2,
  choices: [
    { id: 'dose-extra', name: 'Dose extra de espresso', priceDelta: 400 },
    { id: 'caramelo', name: 'Calda de caramelo', priceDelta: 250 },
    { id: 'chantilly', name: 'Chantilly', priceDelta: 300 },
  ],
};

const grind: OptionGroup = {
  id: 'moagem',
  kind: 'choice',
  title: 'Moagem',
  description: 'Moemos na hora, do jeito do seu preparo.',
  min: 1,
  max: 1,
  choices: [
    { id: 'graos', name: 'Em grãos', priceDelta: 0 },
    { id: 'fina', name: 'Fina', description: 'Para espresso', priceDelta: 0 },
    { id: 'media', name: 'Média', description: 'Para coado e V60', priceDelta: 0 },
    { id: 'grossa', name: 'Grossa', description: 'Para prensa francesa', priceDelta: 0 },
  ],
};

export const products: Product[] = [
  // Combos
  {
    id: 'combo-cafe-da-manha',
    name: 'Combo Café da Manhã',
    description: 'Café com leite à escolha, croissant de presunto e queijo e porção de pão de queijo.',
    categoryId: 'combos',
    basePrice: 3490,
    compareAtPrice: 4670,
    image: image('combo-cafe-da-manha', 'Cappuccino com arte no leite ao lado de croissants'),
    popularity: 76,
    serves: 'Serve 1 pessoa',
    available: true,
    tags: ['combo', 'promoção', 'café da manhã', 'croissant', 'pão de queijo'],
    optionGroups: [
      {
        id: 'bebida',
        kind: 'choice',
        title: 'Café com leite',
        min: 1,
        max: 1,
        choices: [
          { id: 'cappuccino', name: 'Cappuccino', priceDelta: 0 },
          { id: 'latte', name: 'Latte', priceDelta: 0 },
          { id: 'latte-gelado', name: 'Latte gelado', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'combo-cafe-a-dois',
    name: 'Café a Dois',
    description: '2 cafés com leite à escolha e 2 croissants na manteiga.',
    categoryId: 'combos',
    basePrice: 3490,
    compareAtPrice: 4560,
    image: image('combo-cafe-a-dois', 'Mesa vista de cima com dois cafés e croissants'),
    popularity: 70,
    serves: 'Serve 2 pessoas',
    available: true,
    tags: ['combo', 'promoção', 'dois', 'casal', 'croissant'],
    optionGroups: [
      {
        id: 'cafes',
        kind: 'choice',
        title: 'Cafés',
        min: 1,
        max: 1,
        choices: [
          { id: 'cappuccinos', name: 'Dois cappuccinos', priceDelta: 0 },
          { id: 'lattes', name: 'Dois lattes', priceDelta: 0 },
          { id: 'um-de-cada', name: 'Um de cada', priceDelta: 0 },
        ],
      },
    ],
  },

  // Cafés
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Dose curta e encorpada do nosso blend da casa.',
    categoryId: 'cafes',
    basePrice: 690,
    image: image('espresso', 'Xícara de espresso sobre pires em mesa de madeira'),
    popularity: 72,
    available: true,
    tags: ['café', 'espresso', 'expresso'],
    optionGroups: [
      {
        id: 'dose',
        kind: 'size',
        title: 'Dose',
        min: 1,
        max: 1,
        defaultChoiceIds: ['simples'],
        choices: [
          { id: 'simples', name: 'Simples', description: '50 ml', priceDelta: 0 },
          { id: 'dupla', name: 'Dupla', description: '80 ml', priceDelta: 450 },
        ],
      },
    ],
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso, leite vaporizado e espuma cremosa.',
    categoryId: 'cafes',
    basePrice: 1290,
    image: image('cappuccino', 'Cappuccino com arte no leite em xícara branca'),
    badge: 'mais-vendido',
    rating: { value: 4.9, isDemo: true },
    popularity: 98,
    featured: true,
    available: true,
    tags: ['café', 'cappuccino', 'leite'],
    optionGroups: [cupSizes, milk, coffeeExtras],
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espresso com bastante leite vaporizado e arte na espuma.',
    categoryId: 'cafes',
    basePrice: 1390,
    image: image('latte', 'Latte com coração desenhado na espuma'),
    badge: 'popular',
    rating: { value: 4.8, isDemo: true },
    popularity: 91,
    featured: true,
    available: true,
    tags: ['café', 'latte', 'leite'],
    optionGroups: [cupSizes, milk, coffeeExtras],
  },
  {
    id: 'coado-v60',
    name: 'Coado no V60',
    description: 'Café especial filtrado na hora, notas de chocolate e caramelo.',
    categoryId: 'cafes',
    basePrice: 1190,
    image: image('coado-v60', 'Água quente sendo despejada em um coador V60'),
    badge: 'novidade',
    rating: { value: 4.7, isDemo: true },
    popularity: 82,
    featured: true,
    available: true,
    tags: ['café', 'coado', 'filtrado', 'v60', 'especial'],
    optionGroups: [
      {
        id: 'grao',
        kind: 'choice',
        title: 'Grão',
        min: 1,
        max: 1,
        defaultChoiceIds: ['blend'],
        choices: [
          { id: 'blend', name: 'Blend da casa', priceDelta: 0 },
          { id: 'microlote', name: 'Microlote Mantiqueira', priceDelta: 400 },
        ],
      },
    ],
  },

  // Gelados
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    description: 'Extraído a frio por 16 horas e servido com gelo, 350 ml.',
    categoryId: 'gelados',
    basePrice: 1490,
    image: image('cold-brew', 'Cold brew com gelo em pote de vidro'),
    popularity: 79,
    featured: true,
    available: true,
    tags: ['café', 'gelado', 'cold brew'],
  },
  {
    id: 'latte-gelado',
    name: 'Latte Gelado',
    description: 'Espresso, leite gelado e bastante gelo, 400 ml.',
    categoryId: 'gelados',
    basePrice: 1590,
    image: image('latte-gelado', 'Copo de latte gelado com camadas de café e leite'),
    popularity: 68,
    available: true,
    tags: ['café', 'gelado', 'latte', 'leite'],
    optionGroups: [milk, coffeeExtras],
  },

  // Salgados
  {
    id: 'pao-de-queijo',
    name: 'Pão de Queijo',
    description: 'Porção com 6, crocante por fora e macio por dentro.',
    categoryId: 'salgados',
    basePrice: 1490,
    image: image('pao-de-queijo', 'Pães de queijo em um prato ao lado de uma xícara'),
    popularity: 88,
    featured: true,
    available: true,
    tags: ['pão de queijo', 'salgado', 'queijo'],
  },
  {
    id: 'croissant-presunto-queijo',
    name: 'Croissant de Presunto e Queijo',
    description: 'Croissant amanteigado recheado, servido quentinho.',
    categoryId: 'salgados',
    basePrice: 1890,
    image: image('croissant-presunto-queijo', 'Croissants recheados com presunto e queijo'),
    popularity: 64,
    available: true,
    tags: ['croissant', 'salgado', 'presunto', 'queijo'],
  },

  // Doces
  {
    id: 'cinnamon-roll',
    name: 'Cinnamon Roll',
    description: 'Massa macia com canela e cobertura de cream cheese.',
    categoryId: 'doces',
    basePrice: 1490,
    image: image('cinnamon-roll', 'Cinnamon roll com cobertura sobre tábua de madeira'),
    popularity: 77,
    featured: true,
    available: true,
    tags: ['doce', 'canela', 'cinnamon'],
  },
  {
    id: 'cookie-chocolate',
    name: 'Cookie de Chocolate',
    description: 'Crocante nas bordas, com gotas de chocolate meio amargo.',
    categoryId: 'doces',
    basePrice: 990,
    image: image('cookie-chocolate', 'Cookies com gotas de chocolate sobre papel manteiga'),
    popularity: 61,
    available: true,
    tags: ['doce', 'cookie', 'chocolate'],
  },

  // Grãos
  {
    id: 'blend-da-casa',
    name: 'Blend da Casa 250 g',
    description: 'Torra média, notas de chocolate e castanhas.',
    categoryId: 'graos',
    basePrice: 3990,
    image: image('blend-da-casa', 'Pacote aberto cheio de grãos de café torrados'),
    popularity: 56,
    available: true,
    tags: ['café', 'grãos', 'moído', 'pacote'],
    optionGroups: [grind],
  },
  {
    id: 'microlote',
    name: 'Microlote Mantiqueira 250 g',
    description: 'Café especial de microlote, notas florais e de frutas amarelas.',
    categoryId: 'graos',
    basePrice: 5490,
    image: image('microlote', 'Saco de juta com grãos de café torrados'),
    popularity: 48,
    available: true,
    tags: ['café', 'grãos', 'especial', 'microlote', 'pacote'],
    optionGroups: [grind],
  },
];

/** "Mais pedidos", in order. */
export const featuredProductIds = ['cappuccino', 'latte', 'coado-v60', 'cold-brew', 'pao-de-queijo', 'cinnamon-roll'];
