/**
 * `sizes` for each photo slot. Shared by the components and by the theme
 * preloader, so a warmed photo is the same file the slot will request.
 */
export const imageSizes = {
  hero: '(min-width: 1024px) 760px, 70vw',
  combo: '(min-width: 1024px) 620px, 55vw',
  card: '(min-width: 1024px) 300px, (min-width: 640px) 31vw, 46vw',
  row: '108px',
  sheet: '(min-width: 1024px) 600px, 100vw',
  bagLine: '64px',
} as const;
