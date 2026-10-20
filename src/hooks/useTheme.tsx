import { createContext, use, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { getTheme, initialThemeId, themes, type ThemeDefinition, type ThemeId } from '../themes';
import { preloadTheme } from '../themes/preload';

interface ThemeContextValue {
  theme: ThemeDefinition;
  /** What the switcher shows: the requested theme, even while its fonts are still loading. */
  selectedId: ThemeId;
  setTheme: (id: ThemeId) => void;
  /** Warms fonts and first-viewport photos of every theme (the switcher calls it when it opens). */
  prepareAll: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Longest wait for the next theme's fonts before switching anyway. */
const FONT_WAIT_MS = 450;
/** How long <html data-theme-shift> stays on: the token transition (480ms) plus a margin. */
const SHIFT_MS = 700;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function ThemeProvider({ children, initialId }: { children: ReactNode; initialId?: ThemeId }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => initialId ?? initialThemeId());
  const [selectedId, setSelectedId] = useState<ThemeId>(themeId);
  const latestRequest = useRef(0);
  const shiftTimer = useRef(0);
  const theme = getTheme(themeId);

  const setTheme = useCallback((id: ThemeId) => {
    const request = ++latestRequest.current;
    setSelectedId(id);
    void Promise.race([preloadTheme(getTheme(id)), wait(FONT_WAIT_MS)]).then(() => {
      // Repeated switching: only the last choice lands.
      if (request !== latestRequest.current) return;
      // Tokens and type hang on <html data-theme>. The attribute and the new content change in
      // the same task, so no frame mixes two brands and layout effects measure the new type.
      // data-theme-shift turns the token transition on for this change only.
      const root = document.documentElement;
      root.dataset.themeShift = '';
      root.dataset.theme = id;
      window.clearTimeout(shiftTimer.current);
      shiftTimer.current = window.setTimeout(() => delete root.dataset.themeShift, SHIFT_MS);
      flushSync(() => setThemeId(id));
    });
  }, []);

  const prepared = useRef(false);
  const prepareAll = useCallback(() => {
    if (prepared.current) return;
    prepared.current = true;
    for (const candidate of themes) void preloadTheme(candidate);
  }, []);

  // main.tsx sets the first theme before the first paint; this keeps the attribute right anywhere else (tests).
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (root.dataset.theme !== theme.id) root.dataset.theme = theme.id;
  }, [theme.id]);

  useEffect(() => () => window.clearTimeout(shiftTimer.current), []);

  useEffect(() => {
    document.title = `${theme.brand.name.join(' ')} · ${theme.brand.segment}`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.swatches.ground);
    document.querySelector('meta[name="description"]')?.setAttribute('content', theme.brand.description);
  }, [theme]);

  const value = useMemo(() => ({ theme, selectedId, setTheme, prepareAll }), [theme, selectedId, setTheme, prepareAll]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
