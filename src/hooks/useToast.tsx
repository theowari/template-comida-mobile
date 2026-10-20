import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export interface ToastInput {
  message: string;
  tone?: 'success' | 'error';
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface Toast extends ToastInput {
  id: number;
  leaving: boolean;
}

interface ToastContextValue {
  show: (toast: ToastInput) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const EXIT_MS = 300;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)));
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), EXIT_MS);
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const show = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      // One message at a time keeps the top of the screen calm.
      setToasts((current) => [...current.map((toast) => ({ ...toast, leaving: true })), { ...input, id, leaving: false }]);
      window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id === id || !toast.leaving)), EXIT_MS);
      timers.current.set(id, window.setTimeout(() => dismiss(id), input.duration ?? 4000));
    },
    [dismiss],
  );

  const dismissAll = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
    setToasts([]);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const value = useMemo(() => ({ show, dismissAll }), [show, dismissAll]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-[max(12px,env(safe-area-inset-top))]"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            data-leaving={toast.leaving}
            role={toast.tone === 'error' ? 'alert' : undefined}
            className="toast pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-ink py-3 pr-2 pl-4 text-sm text-white shadow-toast"
          >
            {toast.tone === 'error' ? (
              <CircleAlert className="size-5 shrink-0 text-brand-100" aria-hidden />
            ) : (
              <CircleCheck className="size-5 shrink-0 text-[#7ee2a8]" aria-hidden />
            )}
            <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  dismiss(toast.id);
                }}
                className="press focus-light shrink-0 rounded-full px-3 py-2 font-semibold text-white underline-offset-4 hover:underline"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Fechar aviso"
              className="focus-light grid size-9 shrink-0 place-items-center rounded-full text-white/70 hover:text-white"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const context = use(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
