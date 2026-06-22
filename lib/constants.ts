export const ORDER_STATUSES = [
  "RECEIVED",
  "PAYMENT_VERIFICATION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Order Received",
  PAYMENT_VERIFICATION: "Payment Verification",
  CONFIRMED: "Order Confirmed",
  IN_PRODUCTION: "In Production",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

export const STATUS_ICONS: Record<OrderStatus, string> = {
  RECEIVED: "📋",
  PAYMENT_VERIFICATION: "💳",
  CONFIRMED: "✅",
  IN_PRODUCTION: "🎨",
  PACKED: "📦",
  SHIPPED: "🚚",
  OUT_FOR_DELIVERY: "🛵",
  DELIVERED: "🎉",
};

export function isValidTransition(current: string, next: string): boolean {
  const currentIdx = ORDER_STATUSES.indexOf(current as OrderStatus);
  const nextIdx = ORDER_STATUSES.indexOf(next as OrderStatus);
  return currentIdx >= 0 && nextIdx >= 0 && nextIdx > currentIdx;
}

export function getStatusIndex(status: string): number {
  return ORDER_STATUSES.indexOf(status as OrderStatus);
}
