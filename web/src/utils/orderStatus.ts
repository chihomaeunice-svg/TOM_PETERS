import { Clock, CheckCircle2, Truck, PackageCheck, XCircle, LucideIcon } from 'lucide-react';

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: '#E67E22',
  confirmed: '#C9A96E',
  shipped: '#A8B5A0',
  delivered: '#27AE60',
  cancelled: '#C0392B',
};

export const ORDER_STATUS_ICON: Record<string, LucideIcon> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

export const ORDER_STATUS_BG: Record<string, string> = {
  pending: 'bg-tp-warning/10 text-tp-warning',
  confirmed: 'bg-tp-gold/15 text-tp-gold-dark',
  shipped: 'bg-tp-sage/20 text-tp-sage',
  delivered: 'bg-tp-success/10 text-tp-success',
  cancelled: 'bg-tp-error/10 text-tp-error',
};
