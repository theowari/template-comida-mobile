import { BadgeCheck, Bike, ShieldCheck, Tag, type LucideIcon } from 'lucide-react';
import { benefits, type BenefitIcon } from '../../data/store';

const icons: Record<BenefitIcon, LucideIcon> = {
  delivery: Bike,
  quality: BadgeCheck,
  offers: Tag,
  secure: ShieldCheck,
};

export function BenefitsSection() {
  return (
    <section aria-label="Vantagens" className="overflow-hidden rounded-[20px] shadow-card">
      <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = icons[benefit.icon];
          return (
            <li
              key={benefit.id}
              className="flex items-center gap-2 bg-surface px-3 py-3.5 min-[400px]:gap-2.5 min-[400px]:px-3.5 sm:justify-center lg:py-5"
            >
              <Icon className="size-6 shrink-0 text-brand min-[400px]:size-[26px]" strokeWidth={1.7} aria-hidden />
              <p className="min-w-0 leading-tight">
                <span className="block text-[13px] font-semibold lg:text-[15px]">{benefit.title}</span>
                <span className="block text-[12px] text-ink-2 lg:text-[13px]">{benefit.subtitle}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
