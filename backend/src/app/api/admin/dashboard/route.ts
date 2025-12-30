import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Use singleton
import { verifyAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  //  ADMIN AUTH
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized admin" },
      { status: 401 }
    );
  }

  try {
    //  RANGE HARI INI
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    //  METRIC DASHBOARD
    const [
      totalOrders,
      processingOrders,
      readyOrders,
      todayIncome,
      activeOrders,
    ] = await Promise.all([
      // Pesanan Masuk
      prisma.order.count(),

      // Sedang Diproses
      prisma.order.count({
        where: {
          status: {
            in: ["CONFIRMED", "PICKUP", "WASHING", "DRYING", "IRONING", "PROCESSING"],
          },
        },
      }),

      // Siap Diantar
      prisma.order.count({
        where: {
          status: "READY",
        },
      }),

      // Total Pendapatan
      prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          isPaid: true,
        },
      }),

      // Daftar Pesanan Aktif
      prisma.order.findMany({
        where: {
          status: {
            in: ["CREATED", "CONFIRMED", "PICKUP", "WASHING", "DRYING", "IRONING", "PROCESSING", "READY"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          name: true,
          serviceType: true,
          totalPrice: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        summary: {
          pesananMasuk: totalOrders,
          sedangDiproses: processingOrders,
          siapDiantar: readyOrders,
          totalPendapatan: todayIncome._sum.totalPrice ?? 0,
        },
        activeOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data dashboard" },
      { status: 500 }
    );
  }
}
