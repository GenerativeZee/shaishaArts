import { prisma } from "./prisma";

export async function generateOrderCode(): Promise<string> {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { code: "desc" },
    select: { code: true },
  });

  if (!lastOrder) {
    return "SA1001";
  }

  const lastNum = parseInt(lastOrder.code.replace("SA", ""), 10);
  return `SA${lastNum + 1}`;
}
