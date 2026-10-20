import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { imageSizes } from '../../lib/imageSizes';
import type { HeroSlide } from '../../themes/types';
import { FoodImage } from '../ui/FoodImage';

interface HeroBannerProps {
  slides: HeroSlide[];
  onAction: (slide: HeroSlide) => void;
}

/** Dark promotional banner: copy on the left, photo on the right, swipeable with dots. */
export function HeroBanner({ slides, onAction }: HeroBannerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setActive(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = (index + slides.length) % slides.length;
    track.scrollTo({ left: target * track.clientWidth });
  };

  return (
    <section aria-roledescription="carrossel" aria-label="Destaques" className="relative">
      <div ref={trackRef} className="snap-track no-scrollbar flex overflow-x-auto rounded-[22px] bg-oven">
        {slides.map((slide, index) => (
          <div
            // Keyed by position: on a theme change the carousel keeps its place and the photos crossfade.
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${slides.length}`}
            inert={index !== active}
            className="relative isolate flex min-h-[214px] w-full shrink-0 overflow-hidden sm:min-h-[260px] lg:min-h-[380px]"
          >
            <FoodImage
              image={slide.image}
              priority={index === 0}
              sizes={imageSizes.hero}
              className="absolute inset-y-0 right-0 -z-10 h-full w-[64%] object-cover [mask-image:var(--hero-photo-mask)] sm:w-[60%]"
              style={{ objectPosition: slide.focus }}
            />
            {/* Legibility: the dark field owns the copy column and fades into the photo. */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-oven)_36%,color-mix(in_srgb,var(--color-oven)_82%,transparent)_50%,transparent_78%)]"
            />
            <div className="flex w-[64%] max-w-[520px] flex-col justify-center py-5 pr-2 pl-4 sm:pl-7 lg:w-1/2 lg:py-10 lg:pl-12">
              <span className="self-start rounded-full bg-brand px-2 py-1 text-[10px] leading-none font-bold tracking-[0.04em] whitespace-nowrap text-white uppercase min-[400px]:px-2.5 min-[400px]:tracking-[0.07em] lg:text-[12px]">
                {slide.badge}
              </span>
              <h2 className="type-display mt-2.5 [--display-size:29px] sm:[--display-size:38px] lg:mt-4 lg:[--display-size:64px]">
                <span className="block text-white">{slide.titleLines[0]}</span>
                <span className="type-display-accent block text-brand-bright">{slide.titleLines[1]}</span>
              </h2>
              <p className="mt-2 max-w-[30ch] text-[13px] leading-snug text-white/80 lg:mt-4 lg:text-[17px]">{slide.description}</p>
              <button
                type="button"
                onClick={() => onAction(slide)}
                className="press focus-light mt-3.5 inline-flex h-11 items-center gap-2.5 self-start rounded-full bg-brand pr-1.5 pl-4 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark lg:mt-7 lg:h-13 lg:pl-6 lg:text-base"
              >
                {slide.cta}
                <span className="grid size-8 place-items-center rounded-full bg-white text-brand lg:size-10">
                  <ArrowRight className="size-[18px]" strokeWidth={2.5} aria-hidden />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="absolute right-0 bottom-1.5 left-[40%] flex items-center justify-center lg:bottom-4 lg:left-1/2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ir para destaque ${index + 1}: ${slide.titleLines.join(' ')}`}
              aria-current={index === active ? 'true' : undefined}
              className="focus-light grid size-6 place-items-center rounded-full"
            >
              <span
                className={cn(
                  'block h-2 rounded-full transition-[width,background-color] duration-200',
                  index === active ? 'w-5 bg-brand' : 'w-2 bg-white/55',
                )}
              />
            </button>
          ))}
        </div>
      ) : null}

      {slides.length > 1 ? (
        <div className="absolute right-4 bottom-4 hidden gap-2 lg:flex">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Destaque anterior"
            className="press focus-light grid size-11 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Próximo destaque"
            className="press focus-light grid size-11 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </section>
  );
}
