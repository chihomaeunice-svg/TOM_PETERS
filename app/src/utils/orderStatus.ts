import { Colors } from '../theme';

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: Colors.warning,
  confirmed: Colors.gold,
  shipped: Colors.sage,
  delivered: Colors.success,
  cancelled: Colors.error,
};

export const ORDER_STATUS_ICON: Record<string, string> = {
  pending: 'time-outline',
  confirmed: 'checkmark-circle-outline',
  shipped: 'car-outline',
  delivered: 'checkmark-done-circle-outline',
  cancelled: 'close-circle-outline',
};
