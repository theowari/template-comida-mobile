import { bannerSizes, defineImages, productSizes, thumbSizes, unsplash } from '../images';

const root = '/images/themes/cafeteria';
const p = (name: string, id: string) => ({ base: `${root}/products/${name}`, sizes: productSizes, source: unsplash(id) });
const b = (name: string, id: string) => ({ base: `${root}/banners/${name}`, sizes: bannerSizes, source: unsplash(id) });
const c = (name: string, id: string) => ({ base: `${root}/categories/${name}`, sizes: thumbSizes, source: unsplash(id) });

export const { image, sources: imageSources } = defineImages({
  // Products (square, 400 and 800 px)
  espresso: p('espresso', '1705952285570-113e76f63fb0'),
  cappuccino: p('cappuccino', '1621135177072-57c9b6242e7a'),
  latte: p('latte', '1780683072483-81ee520613ae'),
  'coado-v60': p('coado-v60', '1759259639356-7c6e74eed1ec'),
  'latte-gelado': p('latte-gelado', '1461023058943-07fcbe16d735'),
  'cold-brew': p('cold-brew', '1759259639356-6eee63241869'),
  'pao-de-queijo': p('pao-de-queijo', '1559141680-d0bd7bc5af84'),
  'croissant-presunto-queijo': p('croissant-presunto-queijo', '1757124034342-3bbd5364a41d'),
  'cinnamon-roll': p('cinnamon-roll', '1593872571314-4a735d4b27b0'),
  'cookie-chocolate': p('cookie-chocolate', '1782852232674-64bc7f102866'),
  'blend-da-casa': p('blend-da-casa', '1562051036-e0eea191d42f'),
  microlote: p('microlote', '1671225142630-6fd7deff0def'),
  'combo-cafe-da-manha': p('combo-cafe-da-manha', '1763647872237-c76e660cf38b'),
  'combo-cafe-a-dois': p('combo-cafe-a-dois', '1725545904327-4644b45f1a5f'),

  // Banners (4:3, 800 and 1400 px)
  'hero-latte-art': b('hero-latte-art', '1507915135761-41a0a222c709'),
  'hero-metodos': b('hero-metodos', '1619860703338-9c70a1af6a63'),
  'hero-ambiente': b('hero-ambiente', '1565650839149-2c48a094196c'),
  'banner-combo': b('combo', '1565252556328-92ee4a9a0983'),

  // Category thumbnails (192 px)
  'cat-todas': c('todas', '1511920170033-f8396924c348'),
  'cat-cafes': c('cafes', '1512568400610-62da28bc8a13'),
  'cat-gelados': c('gelados', '1767840272154-4eb32b348cdd'),
  'cat-salgados': c('salgados', '1598142982901-df6cec10ae35'),
  'cat-doces': c('doces', '1764281469526-e1c378515e6f'),
  'cat-graos': c('graos', '1776176623816-c4fd0e55f61c'),
});
