import { MapPinOff } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function NotFound() {
  return (
    <div className="pt-16">
      <h1 className="sr-only">Página não encontrada</h1>
      <EmptyState icon={MapPinOff} title="Essa página não existe" actions={<ButtonLink to="/">Voltar ao início</ButtonLink>}>
        O endereço pode ter mudado. Volte ao início para continuar seu pedido.
      </EmptyState>
    </div>
  );
}
