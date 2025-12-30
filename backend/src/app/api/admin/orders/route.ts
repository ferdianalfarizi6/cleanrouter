import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// const prisma = new PrismaClient();

export async function GET(req: Request) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: true } // Include user details if needed
        });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
