import { Check, ChevronDown, Palette } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/cn';
import { themes, type ThemeDefinition } from '../../themes';

/**
 * Demo strip above the store: shows the same site as another segment.
 * Lives outside the brand (ink field), so it reads as a tool, not as part of the store.
 */
export function ThemeBar() {
  const labelId = useId();
  return (
    <div className="bg-ink pt-safe text-white">
      <div className="mx-auto flex h-12 max-w-[1240px] items-center gap-3 px-4 lg:h-11 lg:px-8">
        <p className="flex min-w-0 flex-1 items-center gap-2 text-[13px] leading-tight">
          <Palette className="size-4 shrink-0 text-white/70" strokeWidth={1.9} aria-hidden />
          <span className="hidden text-white/70 md:inline">Demonstração: um mesmo site, quatro marcas.</span>
          <span id={labelId} className="truncate font-medium">
            Ver este site como
          </span>
        </p>
        <ThemeSelect labelledBy={labelId} />
      </div>
    </div>
  );
}

/** Select-only combobox (WAI-ARIA APG): focus stays on the button, options follow aria-activedescendant. */
function ThemeSelect({ labelledBy }: { labelledBy: string }) {
  const { theme, selectedId, setTheme, prepareAll } = useTheme();
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    themes.findIndex((option) => option.id === selectedId),
  );
  const [active, setActive] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const optionId = (index: number) => `${listId}-${index}`;
  const selected = themes[selectedIndex];
  const last = themes.length - 1;

  const openAt = (index: number) => {
    prepareAll();
    setActive(index);
    setOpen(true);
  };

  const choose = (index: number) => {
    setOpen(false);
    if (themes[index].id !== selectedId) setTheme(themes[index].id);
  };

  // Light dismiss: a press anywhere else closes the list without changing the theme.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      const startAt: Partial<Record<string, number>> = {
        ArrowDown: selectedIndex,
        ArrowUp: selectedIndex,
        Enter: selectedIndex,
        ' ': selectedIndex,
        Home: 0,
        End: last,
      };
      const index = startAt[event.key];
      if (index !== undefined) {
        event.preventDefault();
        openAt(index);
      }
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive((current) => Math.min(last, current + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive((current) => Math.max(0, current - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(active);
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  // Screen readers hear the result once the new brand is on screen.
  const [announcement, setAnnouncement] = useState('');
  const announcedTheme = useRef(theme.id);
  useEffect(() => {
    if (announcedTheme.current === theme.id) return;
    announcedTheme.current = theme.id;
    setAnnouncement(`Site exibido como ${theme.label}: ${theme.brand.name.join(' ')}.`);
  }, [theme]);

  return (
    <div ref={rootRef} className="relative shrink-0" onPointerEnter={prepareAll}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openAt(selectedIndex))}
        onKeyDown={onKeyDown}
        onFocus={prepareAll}
        className="press focus-light relative inline-flex h-9 items-center gap-2 rounded-full bg-white/10 pr-2.5 pl-2 text-[14px] font-semibold ring-1 ring-white/20 transition-colors before:absolute before:inset-x-0 before:-inset-y-1 hover:bg-white/15"
      >
        <Swatches theme={selected} ring="ring-ink" />
        <span>{selected.label}</span>
        <ChevronDown
          className={cn('size-4 text-white/80 transition-transform duration-200 ease-out', open && 'rotate-180')}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className="theme-menu absolute top-full right-0 z-50 mt-2 w-[min(17.5rem,calc(100vw-2rem))] rounded-2xl bg-surface p-1.5 text-ink shadow-toast ring-1 ring-line"
        >
          {themes.map((option, index) => {
            const isSelected = option.id === selectedId;
            return (
              <li
                key={option.id}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onPointerMove={() => setActive(index)}
                // Keep focus on the combobox while picking with a pointer.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                className={cn(
                  'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors',
                  index === active ? 'bg-ground-2' : '',
                )}
              >
                <Swatches theme={option} ring="ring-surface" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className={cn('block text-[15px]', isSelected ? 'font-bold' : 'font-medium')}>{option.label}</span>
                  <span className="block truncate text-[13px] text-ink-2">{option.brand.name.join(' ')}</span>
                </span>
                {isSelected ? <Check className="size-5 shrink-0 text-brand" strokeWidth={2.5} aria-hidden /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

/** Three overlapping chips of the theme's palette: ground, banner, brand. */
function Swatches({ theme, ring }: { theme: ThemeDefinition; ring: string }) {
  const { ground, oven, brand } = theme.swatches;
  return (
    <span className="flex shrink-0 -space-x-1.5" aria-hidden>
      {[ground, oven, brand].map((color) => (
        <span
          key={color}
          className={cn('size-4 rounded-full ring-2 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]', ring)}
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}
