import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CONFIRMED_STATUSES = [
  "CONFIRMED","IN_PRODUCTION","PACKED","SHIPPED","OUT_FOR_DELIVERY","DELIVERED",
];

export async function GET() {
  try {
    const [totalOrders, orders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        select: { status: true, totalAmount: true, createdAt: true, code: true, customerName: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const pendingOrders = orders.filter(
      (o) => o.status === "RECEIVED" || o.status === "PAYMENT_VERIFICATION"
    ).length;

    const completedOrders = await prisma.order.count({
      where: { status: "DELIVERED" },
    });

    const confirmedOrders = await prisma.order.findMany({
      where: { status: { in: CONFIRMED_STATUSES } },
      select: { totalAmount: true },
    });

    const revenue = confirmedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue,
      recentOrders: orders,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
