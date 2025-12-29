import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

// VERIFY TOKEN
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

// ===== GET PROFILE =====
export async function GET(req: Request) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user: data });
}

// ===== UPDATE PROFILE =====
export async function PUT(req: Request) {
  try {
    const authUser = verifyToken(req);

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as {
      name?: string;
      email?: string;
      oldPassword?: string;
      newPassword?: string;
    };

    const { name, email, oldPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: authUser.id }
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    // Jika user ingin ganti password
    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { message: "Password lama wajib diisi untuk ganti password" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Password lama salah" },
          { status: 401 }
        );
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });
    }

    // Update name/email jika ada
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ?? user.name,
        email: email ?? user.email,
      },
    });

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
