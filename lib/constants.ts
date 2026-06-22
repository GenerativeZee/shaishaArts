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

export const STATUS_COLORS: Record<string, string> = {
  RECEIVED: "bg-gray-100 text-gray-700",
  PAYMENT_VERIFICATION: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PRODUCTION: "bg-purple-100 text-purple-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
};

export function isValidTransition(current: string, next: string): boolean {
  const currentIdx = ORDER_STATUSES.indexOf(current as OrderStatus);
  const nextIdx = ORDER_STATUSES.indexOf(next as OrderStatus);
  return currentIdx >= 0 && nextIdx >= 0 && nextIdx > currentIdx;
}

export function getStatusIndex(status: string): number {
  return ORDER_STATUSES.indexOf(status as OrderStatus);
}
