import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

// GET Detail Order
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            tracking: {
                orderBy: { timestamp: "desc" }
            }
        }
    });

    if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
}

// PATCH Update Status
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const id = Number(params.id);
        const body = await req.json();
        const { status, isPaid } = body;

        // Transaction: Update Order & Add Tracking History
        const result = await prisma.$transaction(async (tx) => {
            const updateData: any = {};

            if (status) updateData.status = status;
            if (typeof isPaid === "boolean") updateData.isPaid = isPaid;

            // If status is COMPLETED, force paid
            if (status === "COMPLETED") {
                updateData.isPaid = true;
            }

            const updatedOrder = await tx.order.update({
                where: { id },
                data: updateData
            });

            // Only add tracking if status changed
            if (status) {
                await tx.tracking.create({
                    data: {
                        orderId: id,
                        status: status
                    }
                });
            }

            return updatedOrder;
        });

        return NextResponse.json({ message: "Status updated", order: result }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
