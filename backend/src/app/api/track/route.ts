import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";


// const prisma = new PrismaClient();

// verify JWT token
function verifyToken(req: Request) {
    const auth = req.headers.get("authorization");
    if (!auth) return null;
    const token = auth.split(" ")[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
        return null;
    }
}

import { verifyAdmin } from "@/lib/auth";

// OPTIONS for CORS
// tambah tracking admin
export async function POST(req: Request) {
    try {
        const admin = verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized Admin Only" }, { status: 403 });
        }
        const data = (await req.json()) as {
            orderId: number;
            status: string;
        };
        const { orderId, status } = data;
        if (!orderId || !status) {
            return NextResponse.json(
                { message: "Status track wajib diisi" },
                { status: 400 }
            );
        }
        //cek order ada atau tidak
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            return NextResponse.json({ message: "Order tidak ditemukan" }, { status: 404 });
        }
        const tracking = await prisma.tracking.create({
            data: {
                orderId,
                status,
            },
        });
        return NextResponse.json(
            { message: "Tracking ditambahkan", tracking },
            { status: 201 }
        );
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


// get tracking > ambil tracking berdasarkan orderId
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orderIdParam = searchParams.get("orderId");

        if (!orderIdParam) {
            return NextResponse.json({ message: "OrderId diperlukan" }, { status: 400 });
        }

        const tracks = await prisma.tracking.findMany({
            where: {
                orderId: parseInt(orderIdParam)
            },
            orderBy: { timestamp: "desc" },
            include: {
                order: true,
            },
        });

        return NextResponse.json({ tracks }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
    }
}