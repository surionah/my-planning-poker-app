import { cn } from '@/lib/utils';
import { TicketStatus } from '@/types';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple';
}

function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {label}
    </span>
  );
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config: Record<TicketStatus, { label: string; variant: BadgeProps['variant'] }> = {
    [TicketStatus.PENDING]: { label: 'Pendiente', variant: 'default' },
    [TicketStatus.VOTING]: { label: 'Votando', variant: 'warning' },
    [TicketStatus.REVEALED]: { label: 'Revelado', variant: 'info' },
    [TicketStatus.COMPLETED]: { label: 'Completado', variant: 'success' },
  };
  const { label, variant } = config[status];
  return <Badge label={label} variant={variant} />;
}
