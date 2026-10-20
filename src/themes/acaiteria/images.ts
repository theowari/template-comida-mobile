import { bannerSizes, defineImages, productSizes, thumbSizes, unsplash } from '../images';

const root = '/images/themes/acaiteria';
const p = (name: string, id: string) => ({ base: `${root}/products/${name}`, sizes: productSizes, source: unsplash(id) });
const b = (name: string, id: string) => ({ base: `${root}/banners/${name}`, sizes: bannerSizes, source: unsplash(id) });
const c = (name: string, id: string) => ({ base: `${root}/categories/${name}`, sizes: thumbSizes, source: unsplash(id) });

export const { image, sources: imageSources } = defineImages({
  // Products (square, 400 and 800 px)
  'acai-tradicional': p('acai-tradicional', '1676515841519-7bb498597c73'),
  'acai-morango': p('acai-morango', '1590288488147-f46142daf112'),
  'acai-copo': p('acai-copo', '1524904237821-786af6d620ca'),
  'copo-trufado': p('copo-trufado', '1709139068234-f83a548f3bec'),
  'bowl-tropical': p('bowl-tropical', '1787980342670-5efa8eadf225'),
  'bowl-pitaya': p('bowl-pitaya', '1590301157284-ab2f8707bdc1'),
  'smoothie-acai-banana': p('smoothie-acai-banana', '1643470758221-45463a3d210a'),
  'smoothie-morango': p('smoothie-morango', '1589733955941-5eeaf752f6dd'),
  'agua-de-coco': p('agua-de-coco', '1617611140379-0e0ec17cc45f'),
  'suco-verde': p('suco-verde', '1654084767590-a38c7f0f5bd3'),
  'combo-dupla': p('combo-dupla', '1627308594190-a057cd4bfac8'),
  'combo-galera': p('combo-galera', '1674316037121-5210009059f5'),

  // Banners (4:3, 800 and 1400 px)
  'hero-tigela': b('hero-tigela', '1672959202028-51e3b71255bd'),
  'hero-bowl': b('hero-bowl', '1622390001194-1af7f50c873a'),
  'hero-smoothie': b('hero-smoothie', '1615478503562-ec2d8aa0e24e'),
  'banner-combo': b('combo', '1684403620650-81dc661a69db'),

  // Category thumbnails (192 px)
  'cat-todas': c('todas', '1590301157411-8686d4a34f10'),
  'cat-acai': c('acai', '1676515841519-7bb498597c73'),
  'cat-copos': c('copos', '1727041428382-a0cc1f5524e0'),
  'cat-bowls': c('bowls', '1550335430-182e6165c01c'),
  'cat-smoothies': c('smoothies', '1643470758220-a8552dbdceaa'),
  'cat-bebidas': c('bebidas', '1761576881090-a3253f7e53dc'),
});
