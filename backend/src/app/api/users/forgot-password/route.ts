import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
export async function POST(req: Request) {
  try {
    const body = await req.json() as { email?: string };
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "Email tidak terdaftar" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp: new Date(Date.now() + 15 * 60 * 1000), // 15 menit
      },
    });

    return NextResponse.json({
      message: "Token reset berhasil dibuat",
      resetToken,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
