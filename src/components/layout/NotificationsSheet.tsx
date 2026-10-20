import { BellOff } from 'lucide-react';
import { notifications } from '../../data/store';
import { useOverlay } from '../../hooks/useOverlay';
import { formatDateTime } from '../../lib/format';
import { EmptyState } from '../ui/EmptyState';
import { Sheet, SheetHeader } from '../ui/Sheet';

export function NotificationsSheet() {
  const overlay = useOverlay('avisos');
  return (
    <Sheet open={overlay.isOpen} onClose={overlay.close} labelledBy="avisos-titulo" width={440}>
      <SheetHeader titleId="avisos-titulo" title="Notificações" onClose={overlay.close} />
      <div className="sheet-body">
        {notifications.length === 0 ? (
          <EmptyState icon={BellOff} title="Nada por aqui" headingLevel="h3" className="pb-12">
            Avisos sobre seus pedidos aparecem aqui quando a loja estiver conectada a um sistema de pedidos.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line px-4">
            {notifications.map((notification) => (
              <li key={notification.id} className="py-4">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-[14px] text-ink-2">{notification.body}</p>
                <p className="mt-1 text-[12px] text-ink-2">{formatDateTime(notification.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  );
}
