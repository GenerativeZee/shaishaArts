export interface OrderItem {
  name: string;
  qty: number;
}

export function buildOrderMessage(o: {
  code: string;
  items: OrderItem[];
  total: number;
}) {
  const lines = o.items.map((i) => `• ${i.name} x ${i.qty}`).join("\n");
  const text = `Hello Shaisha Arts! 🌸

I would like to place an order.

🛒 Order ID: ${o.code}

Items:
${lines}

💰 Total: ₹${o.total}

Payment Screenshot Attached.`;

  // Use numeric WhatsApp link for reliable pre-fill
  return `https://wa.me/919897015075?text=${encodeURIComponent(text)}`;
}

export function buildInquiryLink(message: string) {
  return `https://wa.me/919897015075?text=${encodeURIComponent(message)}`;
}
