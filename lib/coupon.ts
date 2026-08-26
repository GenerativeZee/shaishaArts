export interface OfferForDiscount {
  active: boolean;
  code: string | null;
  discountType: string; // "PERCENT" | "FLAT"
  discountValue: number;
}

export function computeDiscount(offer: OfferForDiscount, subtotal: number): number {
  if (offer.discountType === "FLAT") {
    return Math.min(offer.discountValue, subtotal);
  }
  // PERCENT
  const pct = Math.min(Math.max(offer.discountValue, 0), 100);
  return Math.min(Math.round((subtotal * pct) / 100), subtotal);
}

export function couponMatches(offer: OfferForDiscount | null, inputCode: string): boolean {
  if (!offer || !offer.active || !offer.code) return false;
  return offer.code.trim().toLowerCase() === inputCode.trim().toLowerCase();
}
