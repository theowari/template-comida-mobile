import { bannerSizes, defineImages, productSizes, thumbSizes, unsplash } from '../images';

const p = (name: string, id: string) => ({ base: `/images/products/${name}`, sizes: productSizes, source: unsplash(id) });
const b = (name: string, id: string) => ({ base: `/images/banners/${name}`, sizes: bannerSizes, source: unsplash(id) });
const c = (name: string, id: string) => ({ base: `/images/categories/${name}`, sizes: thumbSizes, source: unsplash(id) });

export const { image, sources: imageSources } = defineImages({
  // Products (square, 400 and 800 px)
  'pizza-suprema': p('pizza-suprema', '1604382354936-07c5d9983bd3'),
  'pizza-quatro-queijos': p('pizza-quatro-queijos', '1773620496832-9b62e8912452'),
  'pizza-bbq-especial': p('pizza-bbq-especial', '1565299624946-b28f40a0ae38'),
  'pizza-pepperoni': p('pizza-pepperoni', '1628840042765-356cda07504e'),
  'pizza-margherita': p('pizza-margherita', '1595854341625-f33ee10dbf94'),
  'pizza-mediterranea': p('pizza-mediterranea', '1681567604770-0dc826c870ae'),
  'pao-de-alho-especial': p('pao-de-alho-especial', '1761344788266-5f6957aeea33'),
  'pao-de-alho-tradicional': p('pao-de-alho-tradicional', '1619535860434-ba1d8fa12536'),
  'frango-empanado': p('frango-empanado', '1562967914-608f82629710'),
  'batata-parmesao': p('batata-parmesao', '1573080496219-bb080dd4f877'),
  'refrigerante-lata': p('refrigerante-lata', '1629654613528-5d0a2e4166de'),
  limonada: p('limonada', '1621263764928-df1444c5e859'),
  'cha-gelado': p('cha-gelado', '1581636625402-29b2a704ef13'),
  brownie: p('brownie', '1636743715220-d8f8dd900b87'),
  'petit-gateau': p('petit-gateau', '1624353365286-3f8d62daad51'),
  'combo-familia': p('combo-familia', '1621510564330-c87695020b53'),
  'combo-casal': p('combo-casal', '1615719413546-198b25453f85'),

  // Banners (4:3, 800 and 1400 px)
  'hero-queijo': b('hero-queijo', '1769458313988-2cd932ab2777'),
  'hero-pepperoni': b('hero-pepperoni', '1777891258113-fa2b0e8edc5f'),
  'hero-sobremesa': b('hero-sobremesa', '1654796605330-8a1248a2cb07'),
  'banner-combo': b('combo', '1506354666786-959d6d497f1a'),

  // Category thumbnails (192 px)
  'cat-todas': c('todas', '1611915365928-565c527a0590'),
  'cat-pizzas': c('pizzas', '1777891257674-36c5532e6654'),
  'cat-paes-de-alho': c('paes-de-alho', '1587676353811-1708ddf47031'),
  'cat-acompanhamentos': c('acompanhamentos', '1585703900468-13c7a978ad86'),
  'cat-bebidas': c('bebidas', '1636144832475-0d81f893354d'),
  'cat-sobremesas': c('sobremesas', '1605807646983-377bc5a76493'),
});
