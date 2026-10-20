import type { OptionGroup, Product } from '../types';
import { image } from './images';

/*
 * DEMO CATALOG. Names, descriptions and prices are demonstrative.
 * Ratings, badges and popularity are not real sales or review data.
 * Replace this module with data from the store's backend.
 */

interface PizzaSeed {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  removable: string[];
}

const pizzaSeeds: PizzaSeed[] = [
  {
    id: 'pizza-suprema',
    name: 'Pizza Suprema',
    description: 'Calabresa, cogumelos, azeitonas, queijo e ingredientes selecionados.',
    basePrice: 4290,
    removable: ['Calabresa', 'Cogumelos', 'Azeitonas'],
  },
  {
    id: 'pizza-quatro-queijos',
    name: 'Pizza Quatro Queijos',
    description: 'Uma combinação cremosa de quatro queijos selecionados.',
    basePrice: 3990,
    removable: ['Gorgonzola'],
  },
  {
    id: 'pizza-bbq-especial',
    name: 'Pizza BBQ Especial',
    description: 'Frango, molho barbecue, cebola e queijo gratinado.',
    basePrice: 4490,
    removable: ['Cebola'],
  },
  {
    id: 'pizza-pepperoni',
    name: 'Pizza Pepperoni',
    description: 'Pepperoni selecionado com muito queijo derretido.',
    basePrice: 4190,
    removable: [],
  },
  {
    id: 'pizza-margherita',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, tomate fresco e manjericão.',
    basePrice: 3690,
    removable: ['Tomate', 'Manjericão'],
  },
  {
    id: 'pizza-mediterranea',
    name: 'Pizza Mediterrânea',
    description: 'Presunto, azeitonas pretas, pimentões e cebola roxa.',
    basePrice: 4390,
    removable: ['Azeitonas', 'Pimentões', 'Cebola roxa'],
  },
];

const slug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

function pizzaOptionGroups(seed: PizzaSeed): OptionGroup[] {
  const groups: OptionGroup[] = [
    {
      id: 'tamanho',
      kind: 'size',
      title: 'Escolha o tamanho',
      min: 1,
      max: 1,
      choices: [
        { id: 'media', name: 'Média', description: '6 fatias · serve 2 pessoas', priceDelta: 0 },
        { id: 'grande', name: 'Grande', description: '8 fatias · serve 3 pessoas', priceDelta: 1000 },
        { id: 'familia', name: 'Família', description: '12 fatias · serve 4 a 5 pessoas', priceDelta: 1800 },
      ],
    },
    {
      id: 'meio-a-meio',
      kind: 'flavor',
      title: 'Quer meio a meio?',
      description: 'Metade de outro sabor. Vale o preço do sabor mais caro.',
      min: 1,
      max: 1,
      defaultChoiceIds: ['inteira'],
      choices: [
        { id: 'inteira', name: 'Não, pizza inteira', priceDelta: 0 },
        ...pizzaSeeds
          .filter((other) => other.id !== seed.id)
          .map((other) => ({
            id: other.id,
            name: `Metade ${other.name.replace('Pizza ', '')}`,
            priceDelta: Math.max(0, other.basePrice - seed.basePrice),
          })),
      ],
    },
    {
      id: 'massa',
      kind: 'crust',
      title: 'Tipo de massa',
      min: 1,
      max: 1,
      defaultChoiceIds: ['tradicional'],
      choices: [
        { id: 'tradicional', name: 'Tradicional', priceDelta: 0 },
        { id: 'fina', name: 'Fina e crocante', priceDelta: 0 },
        { id: 'pan', name: 'Pan', description: 'Massa alta e macia', priceDelta: 400 },
      ],
    },
    {
      id: 'borda',
      kind: 'border',
      title: 'Borda',
      min: 1,
      max: 1,
      defaultChoiceIds: ['sem-borda'],
      choices: [
        { id: 'sem-borda', name: 'Sem borda recheada', priceDelta: 0 },
        { id: 'catupiry', name: 'Borda de catupiry', priceDelta: 700 },
        { id: 'cheddar', name: 'Borda de cheddar', priceDelta: 700 },
        { id: 'chocolate', name: 'Borda de chocolate', priceDelta: 900 },
      ],
    },
    {
      id: 'adicionais',
      kind: 'extra',
      title: 'Adicionais',
      description: 'Escolha até 3.',
      min: 0,
      max: 3,
      choices: [
        { id: 'bacon', name: 'Bacon', priceDelta: 500 },
        { id: 'catupiry-extra', name: 'Catupiry extra', priceDelta: 400 },
        { id: 'cheddar-extra', name: 'Cheddar extra', priceDelta: 400 },
        { id: 'cebola-caramelizada', name: 'Cebola caramelizada', priceDelta: 300 },
        { id: 'champignon', name: 'Champignon', priceDelta: 400 },
        { id: 'azeitonas-extra', name: 'Azeitonas pretas', priceDelta: 200 },
      ],
    },
  ];

  if (seed.removable.length > 0) {
    groups.push({
      id: 'remover',
      kind: 'remove',
      title: 'Remover ingredientes',
      min: 0,
      max: seed.removable.length,
      choices: seed.removable.map((ingredient) => ({
        id: `sem-${slug(ingredient)}`,
        name: `Sem ${ingredient.toLowerCase()}`,
        priceDelta: 0,
      })),
    });
  }

  return groups;
}

function pizza(seed: PizzaSeed, extra: Partial<Product>): Product {
  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    categoryId: 'pizzas',
    basePrice: seed.basePrice,
    image: image(seed.id as Parameters<typeof image>[0], `${seed.name} inteira vista de cima`),
    popularity: 50,
    available: true,
    optionGroups: pizzaOptionGroups(seed),
    tags: ['pizza'],
    ...extra,
  };
}

const [suprema, quatroQueijos, bbq, pepperoni, margherita, mediterranea] = pizzaSeeds;

const pizzaFlavorChoices = pizzaSeeds.map((seed) => ({ id: seed.id, name: seed.name, priceDelta: 0 }));

export const products: Product[] = [
  // Combos
  {
    id: 'combo-familia',
    name: 'Combo Família',
    description: '1 pizza grande do sabor que você quiser, Pão de Alho Especial e refrigerante 2 L.',
    categoryId: 'combos',
    basePrice: 6290,
    compareAtPrice: 8380,
    image: image('combo-familia', 'Pizza inteira dentro da caixa de entrega'),
    popularity: 75,
    serves: 'Serve 3 a 4 pessoas',
    available: true,
    tags: ['combo', 'promoção', 'família'],
    optionGroups: [
      { id: 'sabor', kind: 'flavor', title: 'Sabor da pizza grande', min: 1, max: 1, choices: pizzaFlavorChoices },
      {
        id: 'refrigerante',
        kind: 'choice',
        title: 'Refrigerante 2 L',
        min: 1,
        max: 1,
        choices: [
          { id: 'cola', name: 'Cola', priceDelta: 0 },
          { id: 'guarana', name: 'Guaraná', priceDelta: 0 },
          { id: 'laranja', name: 'Laranja', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'combo-casal',
    name: 'Combo Casal',
    description: '1 pizza média do sabor que você quiser e 2 refrigerantes lata.',
    categoryId: 'combos',
    basePrice: 3990,
    compareAtPrice: 5670,
    image: image('combo-casal', 'Pizza com legumes servida com pão e tomates'),
    popularity: 72,
    serves: 'Serve 2 pessoas',
    available: true,
    tags: ['combo', 'promoção', 'casal', 'dois'],
    optionGroups: [
      { id: 'sabor', kind: 'flavor', title: 'Sabor da pizza média', min: 1, max: 1, choices: pizzaFlavorChoices },
      {
        id: 'refrigerante',
        kind: 'choice',
        title: 'Sabor dos 2 refrigerantes',
        min: 1,
        max: 1,
        choices: [
          { id: 'cola', name: 'Cola', priceDelta: 0 },
          { id: 'cola-zero', name: 'Cola zero', priceDelta: 0 },
          { id: 'guarana', name: 'Guaraná', priceDelta: 0 },
          { id: 'laranja', name: 'Laranja', priceDelta: 0 },
        ],
      },
    ],
  },

  // Pizzas
  pizza(suprema, { badge: 'mais-vendido', rating: { value: 4.8, isDemo: true }, popularity: 98, featured: true, tags: ['pizza', 'calabresa'] }),
  pizza(quatroQueijos, { badge: 'popular', rating: { value: 4.7, isDemo: true }, popularity: 92, featured: true, tags: ['pizza', 'queijo', '4 queijos', 'gorgonzola', 'mussarela'] }),
  pizza(bbq, { badge: 'novidade', rating: { value: 4.6, isDemo: true }, popularity: 84, featured: true, tags: ['pizza', 'frango', 'barbecue', 'bbq'] }),
  pizza(pepperoni, { popularity: 88, featured: true, tags: ['pizza', 'pepperoni', 'salame'] }),
  pizza(margherita, { popularity: 66, tags: ['pizza', 'marguerita', 'tomate', 'manjericão'] }),
  pizza(mediterranea, { popularity: 58, tags: ['pizza', 'presunto', 'portuguesa'] }),

  // Pães de alho
  {
    id: 'pao-de-alho-especial',
    name: 'Pão de Alho Especial',
    description: 'Pão crocante com alho, manteiga e queijo.',
    categoryId: 'paes-de-alho',
    basePrice: 1690,
    image: image('pao-de-alho-especial', 'Fatias de pão de alho gratinadas com queijo e ervas'),
    popularity: 80,
    featured: true,
    available: true,
    tags: ['pão', 'alho', 'queijo'],
  },
  {
    id: 'pao-de-alho-tradicional',
    name: 'Pão de Alho Tradicional',
    description: 'Baguete com manteiga de alho e ervas finas. 6 fatias.',
    categoryId: 'paes-de-alho',
    basePrice: 1290,
    image: image('pao-de-alho-tradicional', 'Baguete fatiada com manteiga de ervas sobre tábua'),
    popularity: 52,
    available: true,
    tags: ['pão', 'alho', 'baguete'],
  },

  // Acompanhamentos
  {
    id: 'frango-empanado',
    name: 'Frango Empanado',
    description: 'Tiras de frango empanadas e crocantes, 300 g, com molho da casa.',
    categoryId: 'acompanhamentos',
    basePrice: 2490,
    image: image('frango-empanado', 'Tiras de frango empanado com molho branco e alface'),
    popularity: 70,
    available: true,
    tags: ['frango', 'empanado', 'tiras', 'nuggets'],
    optionGroups: [
      {
        id: 'molho-extra',
        kind: 'extra',
        title: 'Molho extra',
        description: 'Opcional. Escolha até 2.',
        min: 0,
        max: 2,
        choices: [
          { id: 'barbecue', name: 'Barbecue', priceDelta: 300 },
          { id: 'mostarda-mel', name: 'Mostarda e mel', priceDelta: 300 },
          { id: 'maionese-ervas', name: 'Maionese de ervas', priceDelta: 300 },
        ],
      },
    ],
  },
  {
    id: 'batata-parmesao',
    name: 'Batata com Parmesão',
    description: 'Batata frita crocante finalizada com parmesão e ervas, 400 g.',
    categoryId: 'acompanhamentos',
    basePrice: 1990,
    image: image('batata-parmesao', 'Cesta de batata frita com parmesão ralado e ervas'),
    popularity: 64,
    available: true,
    tags: ['batata', 'fritas', 'parmesão'],
  },

  // Bebidas
  {
    id: 'refrigerante-lata',
    name: 'Refrigerante Lata',
    description: 'Lata de 350 ml, bem gelada. Escolha o sabor.',
    categoryId: 'bebidas',
    basePrice: 690,
    image: image('refrigerante-lata', 'Copo de refrigerante de cola com gelo'),
    popularity: 78,
    available: true,
    tags: ['refri', 'refrigerante', 'cola', 'guaraná', 'bebida'],
    optionGroups: [
      {
        id: 'sabor',
        kind: 'choice',
        title: 'Sabor',
        min: 1,
        max: 1,
        choices: [
          { id: 'cola', name: 'Cola', priceDelta: 0 },
          { id: 'cola-zero', name: 'Cola zero', priceDelta: 0 },
          { id: 'guarana', name: 'Guaraná', priceDelta: 0 },
          { id: 'laranja', name: 'Laranja', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'limonada',
    name: 'Limonada com Hortelã',
    description: 'Limonada natural com hortelã, 500 ml.',
    categoryId: 'bebidas',
    basePrice: 990,
    image: image('limonada', 'Copo de limonada com fatias de limão e hortelã'),
    popularity: 54,
    available: true,
    tags: ['suco', 'limão', 'natural', 'bebida'],
  },
  {
    id: 'cha-gelado',
    name: 'Chá Gelado de Limão',
    description: 'Chá preto gelado com limão, 400 ml.',
    categoryId: 'bebidas',
    basePrice: 790,
    image: image('cha-gelado', 'Copo de chá gelado com rodelas de limão e gelo'),
    popularity: 40,
    available: true,
    tags: ['chá', 'mate', 'bebida'],
  },

  // Sobremesas
  {
    id: 'brownie',
    name: 'Brownie de Chocolate',
    description: 'Brownie macio com chocolate intenso.',
    categoryId: 'sobremesas',
    basePrice: 1290,
    image: image('brownie', 'Pilha de brownies de chocolate'),
    popularity: 76,
    featured: true,
    available: true,
    tags: ['doce', 'chocolate', 'sobremesa'],
    optionGroups: [
      {
        id: 'acompanhamento',
        kind: 'extra',
        title: 'Acompanhamento',
        description: 'Opcional.',
        min: 0,
        max: 1,
        choices: [{ id: 'sorvete', name: 'Bola de sorvete de creme', priceDelta: 500 }],
      },
    ],
  },
  {
    id: 'petit-gateau',
    name: 'Petit Gâteau',
    description: 'Bolinho quente de chocolate com sorvete de creme.',
    categoryId: 'sobremesas',
    basePrice: 1890,
    image: image('petit-gateau', 'Petit gâteau com bola de sorvete em prato escuro'),
    popularity: 60,
    available: true,
    tags: ['doce', 'chocolate', 'sorvete', 'sobremesa'],
  },
];

const byId = new Map(products.map((product) => [product.id, product]));

export function getProduct(id: string | null | undefined): Product | undefined {
  return id ? byId.get(id) : undefined;
}

/** "Mais pedidos": order follows the brief. */
export const featuredProductIds = [
  'pizza-suprema',
  'pizza-quatro-queijos',
  'pizza-bbq-especial',
  'pizza-pepperoni',
  'pao-de-alho-especial',
  'brownie',
];
