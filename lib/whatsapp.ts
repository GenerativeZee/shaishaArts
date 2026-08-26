export const WA_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/message/CEM5UYC3ORSYJ1"; // general chat (header/footer/contact)
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "9897015074";
const WA_ORDER_PHONE = `91${CONTACT_PHONE}`; // regular WhatsApp — supports ?text= pre-fill

export interface OrderItem {
  name: string;
  qty: number;
}

export function buildOrderMessage(o: {
  code: string;
  items: OrderItem[];
  total: number;
  giftMessage?: string | null;
}): { text: string; link: string } {
  const lines = o.items.map((i) => `• ${i.name} x ${i.qty}`).join("\n");
  const giftLine = o.giftMessage ? `\n\n🎁 Gift Message: "${o.giftMessage}"` : "";
  const text = `Hello Shaisha Arts! 🌸

I would like to place an order.

🛒 Order ID: ${o.code}

Items:
${lines}

💰 Total: ₹${o.total}${giftLine}

Payment Screenshot Attached.`;

  const link = `https://wa.me/${WA_ORDER_PHONE}?text=${encodeURIComponent(text)}`;
  return { text, link };
}

export function buildInquiryLink(message: string) {
  return WA_LINK;
}
