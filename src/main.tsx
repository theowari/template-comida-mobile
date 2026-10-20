import '@fontsource-variable/inter';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/barlow-condensed/latin-800-italic.css';
// Theme faces: declared here, downloaded only when a theme uses them.
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import '@fontsource-variable/figtree';
import '@fontsource-variable/besley';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/onest';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initialThemeId } from './themes';
import './index.css';

// Before the first paint, so a ?tema= link never flashes the default palette.
document.documentElement.dataset.theme = initialThemeId();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
