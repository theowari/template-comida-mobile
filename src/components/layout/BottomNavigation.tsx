import { NavLink } from 'react-router';
import { cn } from '../../lib/cn';
import { primaryNav } from './navigation';

/** Fixed bottom bar on phones and tablets, with the raised red center item from the reference. */
export function BottomNavigation() {
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="mx-auto max-w-[560px] px-3 pb-[max(8px,env(safe-area-inset-bottom))]">
        <ul className="grid h-16 grid-cols-5 items-stretch rounded-[22px] bg-surface px-1 shadow-nav">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to} className="flex">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'press relative flex flex-1 flex-col items-center justify-end gap-1 rounded-2xl pb-2.5 text-[11px] leading-none',
                      item.featured ? 'justify-start' : '',
                      isActive ? 'font-bold text-brand-dark' : 'font-medium text-ink-2 hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) =>
                    item.featured ? (
                      <span
                        className={cn(
                          'absolute -top-6 left-1/2 flex size-[66px] -translate-x-1/2 flex-col items-center justify-center gap-0.5 rounded-full text-white shadow-raised ring-4 ring-ground transition-colors',
                          isActive ? 'bg-brand-dark' : 'bg-brand',
                        )}
                      >
                        <Icon className="size-[22px]" strokeWidth={2} aria-hidden />
                        <span className="text-[11px] font-bold">{item.label}</span>
                        {isActive ? <span className="absolute -bottom-2.5 h-1 w-5 rounded-full bg-brand-dark" aria-hidden /> : null}
                      </span>
                    ) : (
                      <>
                        {isActive ? <span className="absolute top-0 h-[3px] w-6 rounded-b-full bg-brand" aria-hidden /> : null}
                        <Icon className={cn('size-[22px]', isActive ? 'text-brand' : '')} strokeWidth={isActive ? 2.2 : 1.8} aria-hidden />
                        {item.label}
                      </>
                    )
                  }
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Space the fixed bottom bar takes, so content is never hidden under it. */
export const BOTTOM_NAV_SPACE = 'calc(64px + max(8px, env(safe-area-inset-bottom)) + 24px)';
