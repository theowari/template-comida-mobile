import { bannerSizes, defineImages, productSizes, thumbSizes, unsplash } from '../images';

const root = '/images/themes/confeitaria';
const p = (name: string, id: string) => ({ base: `${root}/products/${name}`, sizes: productSizes, source: unsplash(id) });
const b = (name: string, id: string) => ({ base: `${root}/banners/${name}`, sizes: bannerSizes, source: unsplash(id) });
const c = (name: string, id: string) => ({ base: `${root}/categories/${name}`, sizes: thumbSizes, source: unsplash(id) });

export const { image, sources: imageSources } = defineImages({
  // Products (square, 400 and 800 px)
  'bolo-red-velvet': p('bolo-red-velvet', '1714949134591-d6f2c581b20d'),
  'bolo-cenoura': p('bolo-cenoura', '1650937254058-d952a67a4f46'),
  'naked-cake': p('naked-cake', '1608830597604-619220679440'),
  'torta-limao': p('torta-limao', '1618591646018-7fa30c56fab1'),
  cheesecake: p('cheesecake', '1676300187262-daac9507102d'),
  'torta-morango': p('torta-morango', '1503485838016-53579610c389'),
  macarons: p('macarons', '1558326567-98ae2405596b'),
  brigadeiros: p('brigadeiros', '1630953899906-d16511a72558'),
  'cupcake-morango': p('cupcake-morango', '1607478900766-efe13248b125'),
  'cupcake-chocolate': p('cupcake-chocolate', '1652284918100-1fd4a60e7356'),
  'chocolate-quente': p('chocolate-quente', '1517578239113-b03992dcdd25'),
  'limonada-rosa': p('limonada-rosa', '1563572912886-754e26f4c4b6'),
  'caixa-presente': p('caixa-presente', '1771016834009-bda415d14c64'),
  'cafe-da-tarde': p('cafe-da-tarde', '1775836610105-78de57a2f614'),

  // Banners (4:3, 800 and 1400 px)
  'hero-vitrine': b('hero-vitrine', '1776797142667-dcee509ff200'),
  'hero-macarons': b('hero-macarons', '1702745572427-c7c772b45ff3'),
  'hero-encomenda': b('hero-encomenda', '1568827999250-3f6afff96e66'),
  'banner-combo': b('combo', '1691052252990-4cd1fdda73dc'),

  // Category thumbnails (192 px)
  'cat-todas': c('todas', '1583338917451-face2751d8d5'),
  'cat-bolos': c('bolos', '1659489397202-cd5d8875806b'),
  'cat-tortas': c('tortas', '1778448411813-34dab2b0b952'),
  'cat-docinhos': c('docinhos', '1569864358642-9d1684040f43'),
  'cat-cupcakes': c('cupcakes', '1599785209796-786432b228bc'),
  'cat-bebidas': c('bebidas', '1707219811253-b4197a022ffa'),
});
