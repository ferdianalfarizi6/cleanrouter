import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { calculatePrice, ServiceType } from "@/lib/pricing";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized admin" },
      { status: 401 }
    );
  }

  const id = Number(params.id);
  const body = await req.json() as {
    weight: number;
  };

  const { weight } = body;

  // VALIDASI BERAT
  if (!weight || weight <= 0) {
    return NextResponse.json(
      { message: "Berat tidak valid" },
      { status: 400 }
    );
  }
  // AMBIL DATA ORDER
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json(
      { message: "Order tidak ditemukan" },
      { status: 404 }
    );
  }

  if (order.status !== "CREATED") {
    return NextResponse.json(
      { message: "Order sudah dikonfirmasi" },
      { status: 400 }
    );
  }
  // HITUNG TOTAL HARGA
  const totalPrice = calculatePrice(
    order.serviceType as ServiceType,
    weight
  );
  // UPDATE ORDER DAN TAMBAH TRACKING DENGAN TRANSAKSI
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: {
        weight,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    await tx.tracking.create({
      data: {
        orderId: id,
        status: "CONFIRMED",
      },
    });

    return updated;
  });

  // RESPONSE
  return NextResponse.json(
    { message: "Order berhasil dikonfirmasi", order: updatedOrder },
    { status: 200 }
  );
}
