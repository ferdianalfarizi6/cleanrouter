import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email?: string;
  username?: string;
  role: string;
}

// ===== VERIFY TOKEN =====
function verifyToken(req: Request): TokenPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return null;
  }
}

// ===== GET ORDER DETAIL =====
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}


type OrderUpdatePayload = {
  name?: string;
  phone?: string;
  address?: string;
  serviceType?: string;
  weight?: number;
  totalPrice?: number;
};

// ===== UPDATE ORDER =====
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  // const body = await req.json(); // REMOVE DUPLICATE

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json(
      { message: "Order tidak ditemukan" },
      { status: 404 }
    );
  }

  // CEGAH UPDATE JIKA SUDAH KONFIRMASI
  if (order.status !== "CREATED") {
    return NextResponse.json(
      { message: "Order sudah diproses, tidak bisa diubah" },
      { status: 403 }
    );
  }

  // === RULE USER ===
  if (user.role !== "admin") {
    if (order.userId !== user.id) {
      return NextResponse.json(
        { message: "Tidak punya akses ke order ini" },
        { status: 403 }
      );
    }
    if (order.isPaid) {
      return NextResponse.json(
        { message: "Order sudah dibayar, tidak bisa diubah" },
        { status: 403 }
      );
    }
  }

  // --- LOGIC UPDATE ---
  // Fields allowed to update: name, phone, address, weight, packageId
  const body = await req.json() as {
    name?: string;
    phone?: string;
    address?: string;
    weight?: any;
    packageId?: string;
  };

  const { name, phone, address, weight, packageId } = body;

  let updateData: any = {
    name: name ?? order.name,
    phone: phone ?? order.phone,
    address: address ?? order.address,
  };

  // Logic Recalculate Price if Package or Weight changes
  if (packageId || weight) {
    // 1. Determine Weight (Use new OR old)
    const finalWeight = weight !== undefined ? parseFloat(weight) : (order.weight ?? 0);

    // 2. Determine Package/Price
    // If packageId supplied, fetch it to get price.
    // If no packageId, we MUST fetch current price based on old serviceType?? SUSAH.
    // Better: User MUST supply packageId if they want to recalculate price, 
    // OR we just use current price if we can find a package with that serviceType.
    // SIMPLIFICATION: If Updating Weight/Package, require PackageId from frontend for accuracy.

    let pricePerKg = 0;
    let newServiceType = order.serviceType;

    if (packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (!pkg) {
        return NextResponse.json({ message: "Paket tidak valid" }, { status: 400 });
      }
      pricePerKg = pkg.price;
      newServiceType = pkg.serviceType;
    } else {
      // Fallback: Find package with same serviceType, pick highest price? or just fail?
      // Frontend should send packageId.
      // For safety let's try to find a matching package by serviceType label
      const pkg = await prisma.package.findFirst({ where: { serviceType: order.serviceType as any } });
      if (pkg) pricePerKg = pkg.price;
      else pricePerKg = 7000; // Fallback hardcoded
    }

    updateData.weight = finalWeight;
    updateData.totalPrice = finalWeight * pricePerKg;
    updateData.serviceType = newServiceType;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(
    { message: "Order diperbarui", order: updated },
    { status: 200 }
  );
}

// ===== DELETE ORDER =====
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = Number(params.id);

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json(
        { message: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    //  CEGAH DELETE JIKA SUDAH BAYAR
    if (order.isPaid === true) {
      return NextResponse.json(
        {
          message:
            "Order sudah dibayar, tidak bisa dihapus. Silakan hubungi CS.",
        },
        { status: 403 }
      );
    }

    //  USER HANYA BISA HAPUS ORDER MILIKNYA SENDIRI (kecuali admin)
    //  Pastikan tipe data cocok (Int vs Int)
    if (user.role !== "admin") {
      if (user.id !== order.userId) {
        return NextResponse.json(
          { message: "Kamu tidak punya akses ke order ini" },
          { status: 403 }
        );
      }
    }

    // ✔ DELETE DIPERBOLEHKAN
    await prisma.order.delete({ where: { id } });

    return NextResponse.json(
      { message: "Order dihapus" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
