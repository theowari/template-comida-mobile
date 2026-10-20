import { X } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the sheet */
  labelledBy: string;
  /** center: bottom sheet on phones, centered dialog on desktop. right: bottom sheet, then side drawer. left: side drawer. */
  variant?: 'center' | 'right' | 'left';
  size?: 'auto' | 'full';
  /** Desktop width for the centered variant. */
  width?: number;
  children: ReactNode;
}

const OPEN_MS = 400;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Modal sheet on the native <dialog>: focus trap, Esc, inert page and
 * focus return come from the platform. Animation is a transform transition.
 */
export function Sheet({ open, onClose, labelledBy, variant = 'center', size = 'auto', width, children }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);

  if (open && !mounted) setMounted(true);

  useEffect(() => {
    openRef.current = open;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !mounted) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      // Commit the closed position before switching to open so the transition runs.
      void panelRef.current?.getBoundingClientRect();
      setVisible(true);
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(
      () => {
        if (dialog.open) dialog.close();
        setMounted(false);
      },
      prefersReducedMotion() ? 200 : OPEN_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [open, mounted]);

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="sheet"
      data-state={visible ? 'open' : 'closed'}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onCloseRef.current();
      }}
      onClose={() => {
        // The browser can close a dialog on its own (repeated Esc): keep the URL in sync.
        if (openRef.current) onCloseRef.current();
      }}
    >
      <div className="sheet-backdrop" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        className="sheet-panel"
        data-variant={variant}
        data-size={size}
        style={width ? ({ '--sheet-width': `${width}px` } as CSSProperties) : undefined}
      >
        {children}
      </div>
    </dialog>,
    document.body,
  );
}

interface SheetHeaderProps {
  titleId: string;
  title: ReactNode;
  onClose: () => void;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SheetHeader({ titleId, title, subtitle, onClose, actions, className }: SheetHeaderProps) {
  return (
    <div className={cn('flex shrink-0 items-center gap-2 border-b border-line px-4 py-3 sm:px-5', className)}>
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="truncate text-lg font-bold tracking-[-0.01em]">
          {title}
        </h2>
        {subtitle ? <p className="truncate text-[13px] text-ink-2">{subtitle}</p> : null}
      </div>
      {actions}
      <CloseButton onClick={onClose} />
    </div>
  );
}

export function CloseButton({ onClick, className, label = 'Fechar' }: { onClick: () => void; className?: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'press grid size-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-ground-2',
        className,
      )}
    >
      <X className="size-[22px]" strokeWidth={2} aria-hidden />
    </button>
  );
}

export function SheetFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'shrink-0 border-t border-line bg-surface px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
