// Helpers for the optional per-product "offer" price (salePrice).
// A sale is only in effect when salePrice is set, positive, and below the
// regular price — otherwise everything falls back to the regular price.

export interface Priced {
  price: number;
  salePrice?: number | null;
}

export function isOnOffer(p: Priced): boolean {
  return typeof p.salePrice === "number" && p.salePrice > 0 && p.salePrice < p.price;
}

/** The amount a customer actually pays for one unit. */
export function effectivePrice(p: Priced): number {
  return isOnOffer(p) ? (p.salePrice as number) : p.price;
}

/** Whole-number percent off, e.g. 20 for "20% off". 0 when not on offer. */
export function discountPercent(p: Priced): number {
  if (!isOnOffer(p)) return 0;
  return Math.round(((p.price - (p.salePrice as number)) / p.price) * 100);
}

/**
 * Normalises a raw offer-price input against the regular price.
 * - blank / 0 / non-numeric  -> { value: null }  (no offer)
 * - a positive number >= regular price -> { error } (rejected)
 * - a valid lower number -> { value: <integer> }
 */
export function parseSalePrice(
  raw: unknown,
  regularPrice: number
): { value: number | null } | { error: string } {
  if (raw === undefined || raw === null || raw === "") return { value: null };
  const n = Math.round(Number(raw));
  if (Number.isNaN(n) || n <= 0) return { value: null };
  if (n >= regularPrice) {
    return { error: `The offer price must be lower than the regular price (₹${regularPrice}).` };
  }
  return { value: n };
}
