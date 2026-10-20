import { useLayoutEffect, useRef, type CSSProperties, type RefObject } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/cn';
import type { LogoMarkId } from '../../themes/types';

/** Original marks: a white symbol on a rounded tile in the theme's brand color. */
const glyphs: Record<LogoMarkId, React.ReactNode> = {
  // Pizza slice with a crust line and three pepperoni.
  slice: (
    <>
      <path d="M16 27.5 5.6 9.6C12 5.9 20 5.9 26.4 9.6Z" className="fill-white" />
      <path d="M8.2 11.4c4.9-2.5 10.7-2.5 15.6 0" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-brand" />
      <circle cx="13" cy="15.2" r="1.8" className="fill-brand" />
      <circle cx="19" cy="14.6" r="1.6" className="fill-brand" />
      <circle cx="16" cy="20.4" r="1.5" className="fill-brand" />
    </>
  ),
  // Cupcake: frosting dome with a cherry, pleated wrapper.
  cupcake: (
    <>
      <circle cx="16" cy="7.4" r="2" className="fill-white" />
      <path d="M7.6 16.6c0-4.2 3.8-7.2 8.4-7.2s8.4 3 8.4 7.2Z" className="fill-white" />
      <path d="M10.4 13.6c3.6 1.3 7.6 1.3 11.2 0" fill="none" strokeWidth="1.4" strokeLinecap="round" className="stroke-brand" />
      <path d="M8.6 18h14.8l-2.1 8.6H10.7Z" className="fill-white" />
      <path d="M13.2 19.4l.6 5.8M16 19.4v5.8m2.8-5.8-.6 5.8" fill="none" strokeWidth="1.3" strokeLinecap="round" className="stroke-brand" />
    </>
  ),
  // Coffee bean with its center crease.
  bean: (
    <g transform="rotate(-32 16 16)">
      <ellipse cx="16" cy="16" rx="7.4" ry="10.6" className="fill-white" />
      <path d="M16 5.8c-3.4 3.6 2.9 7.2 0 10.2s3.4 6.6 0 10.2" fill="none" strokeWidth="1.8" strokeLinecap="round" className="stroke-brand" />
    </g>
  ),
  // Bowl heaped with fruit and granola.
  bowl: (
    <>
      <circle cx="11.2" cy="12.2" r="2.6" className="fill-white" />
      <circle cx="16.4" cy="10.6" r="3.2" className="fill-white" />
      <circle cx="21.4" cy="12.6" r="2.3" className="fill-white" />
      <circle cx="16.4" cy="10.6" r="1" className="fill-brand" />
      <path d="M5.8 15.6h20.4c0 5.6-4.6 10.2-10.2 10.2S5.8 21.2 5.8 15.6Z" className="fill-white" />
      <path d="M9.6 19.6h12.8" fill="none" strokeWidth="1.3" strokeLinecap="round" className="stroke-brand" />
    </>
  ),
};

export function LogoMark({ className, mark }: { className?: string; mark?: LogoMarkId }) {
  const { theme } = useTheme();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="9" className="fill-brand" />
      {glyphs[mark ?? theme.brand.mark]}
    </svg>
  );
}

/**
 * Shrinks the wordmark only when the name is wider than its slot (a wide face in the
 * phone header). Names that fit keep their designed size.
 */
function useWordmarkFit(box: RefObject<HTMLSpanElement | null>, word: RefObject<HTMLSpanElement | null>, name: string) {
  useLayoutEffect(() => {
    const boxElement = box.current;
    const wordElement = word.current;
    if (!boxElement || !wordElement || typeof ResizeObserver === 'undefined') return;

    // Measured at the designed size every time: the box only stays narrower than its
    // content when the slot constrains it, so a name that fits always gets fit 1.
    const update = () => {
      wordElement.style.removeProperty('--fit');
      // The mark is an <svg>: no offsetWidth, so measure its box.
      const markWidth = boxElement.firstElementChild?.getBoundingClientRect().width ?? 0;
      const gap = parseFloat(getComputedStyle(boxElement).columnGap) || 0;
      const available = boxElement.getBoundingClientRect().width - markWidth - gap;
      const natural = wordElement.getBoundingClientRect().width;
      // Half a pixel of slack: subpixel rounding alone never shrinks a name that fits.
      if (available > 0 && natural > available + 0.5) {
        wordElement.style.setProperty('--fit', (Math.floor((available / natural) * 1000) / 1000).toString());
      }
    };

    update();
    let frame = 0;
    // Slot resized or the face finished loading: measure again on the next frame.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    observer.observe(boxElement);
    observer.observe(wordElement);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [box, word, name]);
}

export function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const { theme } = useTheme();
  const [first, second] = theme.brand.name;
  const box = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  useWordmarkFit(box, word, `${first} ${second}`);
  return (
    <span ref={box} className={cn('inline-flex max-w-full min-w-0 items-center gap-2', className)}>
      <LogoMark className={cn('shrink-0', size === 'lg' ? 'size-9' : 'size-8')} />
      <span
        ref={word}
        className="type-wordmark whitespace-nowrap text-ink"
        style={{ '--display-size': size === 'lg' ? '32px' : '27px' } as CSSProperties}
      >
        {first} <span className="text-brand">{second}</span>
      </span>
    </span>
  );
}
