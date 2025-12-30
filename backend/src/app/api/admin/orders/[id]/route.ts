import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

/**
 * =========================
 * GET: Detail Order
 * =========================
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      tracking: {
        orderBy: { timestamp: "desc" },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order }, { status: 200 });
}

/**
 * =========================
 * PATCH: Update Status Order
 * =========================
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
  }

  try {
    const body = (await req.json()) as {
      status?: string;
      isPaid?: boolean;
    };

    const updateData: { status?: string; isPaid?: boolean } = {};

    if (body.status) {
      updateData.status = body.status;
    }

    if (typeof body.isPaid === "boolean") {
      updateData.isPaid = body.isPaid;
    }

    // Force paid when completed
    if (body.status === "COMPLETED") {
      updateData.isPaid = true;
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: updateData,
      });

      if (body.status) {
        await tx.tracking.create({
          data: {
            orderId: id,
            status: body.status,
          },
        });
      }

      return order;
    });

    return NextResponse.json(
      { message: "Order updated", order: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH order error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
