import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

// ===== VERIFY TOKEN =====
function verifyToken(req: Request): any | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

// ===== CREATE ORDER =====
export async function POST(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = (await req.json()) as {
      name: string;
      phone: string;
      address: string;
      packageId: string; // Changed from serviceType (String) to PackageId
      weight: number;
    };

    const { name, phone, address, packageId, weight } = data;

    if (!name || !phone || !packageId || !weight) {
      return NextResponse.json(
        { message: "Data wajib belum lengkap" },
        { status: 400 }
      );
    }

    // Fetch Package Price
    const pkg = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!pkg) {
      return NextResponse.json({ message: "Paket tidak valid" }, { status: 400 });
    }

    const pricePerKg = pkg.price;
    const calculatedTotalPrice = weight * pricePerKg;

    // Cegah order duplikat (Optional logic, adjusted)
    const existingOrder = await prisma.order.findFirst({
      where: {
        phone,
        serviceType: pkg.serviceType, // Use package serviceType
        isPaid: false,
        userId: user.id,
      },
    });

    if (existingOrder) {
      return NextResponse.json(
        { message: "Anda memiliki order belum dibayar dengan layanan ini" },
        { status: 409 }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        name,
        phone,
        address,
        serviceType: pkg.serviceType, // Store the ENUM value or String representation
        weight,
        totalPrice: calculatedTotalPrice,
        isPaid: false,
        userId: user.id,
        status: "CREATED",
      },
    });

    return NextResponse.json(
      { message: "Order dibuat", order: newOrder },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

// ===== GET ORDER USER =====
export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil orders" },
      { status: 500 }
    );
  }
}
