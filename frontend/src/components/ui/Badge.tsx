import { cn } from '@/lib/utils';
import { TicketStatus } from '@/types';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple';
}

function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800',
    warning: 'bg-amber-950/60 text-amber-400 border border-amber-800',
    info: 'bg-cyan-950/60 text-cyan-400 border border-cyan-800',
    purple: 'bg-violet-950/60 text-violet-400 border border-violet-800',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {label}
    </span>
  );
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config: Record<TicketStatus, { label: string; variant: BadgeProps['variant'] }> = {
    [TicketStatus.PENDING]: { label: 'Pending', variant: 'default' },
    [TicketStatus.VOTING]: { label: 'Voting', variant: 'warning' },
    [TicketStatus.REVEALED]: { label: 'Revealed', variant: 'info' },
    [TicketStatus.COMPLETED]: { label: 'Completed', variant: 'success' },
  };
  const { label, variant } = config[status];
  return <Badge label={label} variant={variant} />;
}
