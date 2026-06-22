const WA_LINK = "https://wa.me/message/CEM5UYC3ORSYJ1";

export interface OrderItem {
  name: string;
  qty: number;
}

export function buildOrderMessage(o: {
  code: string;
  items: OrderItem[];
  total: number;
}): { text: string; link: string } {
  const lines = o.items.map((i) => `• ${i.name} x ${i.qty}`).join("\n");
  const text = `Hello Shaisha Arts! 🌸

I would like to place an order.

🛒 Order ID: ${o.code}

Items:
${lines}

💰 Total: ₹${o.total}

Payment Screenshot Attached.`;

  return { text, link: WA_LINK };
}

export function buildInquiryLink(message: string) {
  return `${WA_LINK}`;
}

export { WA_LINK };
