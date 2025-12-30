import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ServiceType } from "@prisma/client";
import { verifyAdmin } from "@/lib/auth"; // Assume verifyAdmin is exported from lib/auth

export const dynamic = 'force-dynamic';

// Public GET for packages
export async function GET() {
    try {
        const packages = await prisma.package.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(packages, { status: 200 });
    } catch (err) {
        console.error("GET PACKAGES ERROR:", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

// Admin CREATE Package
export async function POST(req: Request) {
    try {
        const admin = verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized Admin" }, { status: 401 });
        }

        const data = await req.json() as { label: string; serviceType: ServiceType; price: number };
        const { label, serviceType, price } = data;

        if (!label || !serviceType || price === undefined) {
            return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
        }

        const newPkg = await prisma.package.create({
            data: {
                label,
                serviceType: serviceType,
                price: Number(price)
            }
        });

        return NextResponse.json(newPkg, { status: 201 });

    } catch (err) {
        console.error("CREATE PACKAGE ERROR:", err);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
