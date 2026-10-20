import { useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

/**
 * Sheets and drawers live in the URL (?sacola=1, ?produto=pizza-suprema),
 * so the phone's back button closes them instead of leaving the page.
 */
export type OverlayName = 'sacola' | 'produto' | 'filtros' | 'menu' | 'avisos';

interface OverlayState {
  overlay?: OverlayName;
}

/** Extra params that belong to an overlay and leave with it. */
const companions: Partial<Record<OverlayName, string[]>> = {
  produto: ['editar'],
};

/** Read the URL when the action runs, not when the component rendered (toasts call these later). */
const currentParams = () => new URLSearchParams(window.location.search);

export function useOverlay(name: OverlayName) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const value = params.get(name);

  const open = useCallback(
    (overlayValue = '1', extra?: Record<string, string>) => {
      const next = currentParams();
      for (const key of companions[name] ?? []) next.delete(key);
      next.set(name, overlayValue);
      for (const [key, val] of Object.entries(extra ?? {})) next.set(key, val);
      setParams(next, { state: { overlay: name } satisfies OverlayState, preventScrollReset: true });
    },
    [name, setParams],
  );

  const close = useCallback(() => {
    if ((location.state as OverlayState | null)?.overlay === name && currentParams().has(name)) {
      navigate(-1);
      return;
    }
    const next = currentParams();
    next.delete(name);
    for (const key of companions[name] ?? []) next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  }, [location.state, name, navigate, setParams]);

  return { isOpen: value !== null, value, open, close, params };
}
