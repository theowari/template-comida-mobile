import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { comboBanner } from '../../data/promotions';
import { store } from '../../data/store';
import { FoodImage } from '../ui/FoodImage';

/** Secondary promo: blush field, copy left, food photo right, round "OFF" sticker. */
export function ComboBanner() {
  return (
    <section aria-labelledby="combo-titulo" className="relative isolate overflow-hidden rounded-[22px] bg-blush">
      <FoodImage
        image={comboBanner.image}
        sizes="(min-width: 1024px) 620px, 55vw"
        className="absolute inset-y-0 right-0 -z-10 h-full w-[52%] object-cover [mask-image:linear-gradient(90deg,transparent,#000_38%)]"
        style={{ objectPosition: '40% 50%' }}
      />
      <div className="flex min-h-[176px] w-[60%] max-w-[480px] flex-col justify-center py-5 pl-4 sm:pl-7 lg:min-h-[240px] lg:pl-12">
        <span className="self-start rounded-full bg-brand px-2.5 py-1 text-[10px] leading-none font-bold tracking-[0.06em] whitespace-nowrap text-white uppercase lg:text-[12px]">
          {comboBanner.badge}
        </span>
        <h2
          id="combo-titulo"
          className="mt-2 font-display text-[30px] leading-[0.92] font-extrabold tracking-[-0.005em] text-ink uppercase sm:text-[36px] lg:text-[52px]"
        >
          {comboBanner.title}
        </h2>
        <p className="mt-1.5 text-[13px] leading-snug text-[#5d4b47] lg:text-[16px]">
          {comboBanner.description}
          {store.demoMode ? <span className="block text-[12px]">Desconto demonstrativo.</span> : null}
        </p>
        <Link
          to={comboBanner.to}
          className="press mt-3 inline-flex h-11 items-center gap-2 self-start rounded-full bg-brand pr-4 pl-5 text-[14px] font-semibold text-white shadow-[0_8px_18px_-10px_rgb(184_16_43/0.8)] transition-colors hover:bg-brand-dark lg:h-12 lg:text-[15px]"
        >
          {comboBanner.cta}
          <ArrowRight className="size-[18px]" strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
      <p
        aria-hidden
        className="absolute top-3 right-3 grid size-[70px] rotate-[-8deg] place-items-center rounded-full bg-brand font-display leading-none font-extrabold text-white shadow-raised lg:top-6 lg:right-8 lg:size-[104px]"
      >
        <span className="flex flex-col items-center">
          <span className="text-[26px] lg:text-[40px]">{comboBanner.sticker}</span>
          <span className="text-[14px] tracking-[0.06em] lg:text-[20px]">OFF</span>
        </span>
      </p>
    </section>
  );
}
