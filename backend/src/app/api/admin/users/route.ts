import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";


// const prisma = new PrismaClient();

export async function GET(req: Request) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("GET USERS ERROR:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
