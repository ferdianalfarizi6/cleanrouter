import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

//CHECK ADMIN TOKEN
function verifyAdmin(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!); // return payload admin
  } catch {
    return null;
  }
}

// GET TRACKING BY ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trackId = Number(params.id);

    const tracking = await prisma.tracking.findUnique({
      where: { id: trackId },
      include: {
        order: true,
      },
    });

    if (!tracking) {
      return NextResponse.json({ message: "Tracking tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ tracking });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil tracking" }, { status: 500 });
  }
}


// UPDATE TRACKING BY ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const trackId = Number(params.id);

    const data = (await req.json()) as {
      status?: string;
    };

    if (!data.status) {
      return NextResponse.json({ message: "Status wajib diisi" }, { status: 400 });
    }

    const updated = await prisma.tracking.update({
      where: { id: trackId },
      data: {
        status: data.status,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ message: "Tracking diupdate", tracking: updated });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update tracking" }, { status: 500 });
  }
}

// DELETE TRACKING BY ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const trackId = Number(params.id);

    await prisma.tracking.delete({
      where: { id: trackId },
    });

    return NextResponse.json({ message: "Tracking dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus tracking" }, { status: 500 });
  }
}