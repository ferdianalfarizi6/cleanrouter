import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function POST(req: Request) {
  try {
    console.log("LOGIN ADMIN HIT");
    const body = await req.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: Number(admin.id),
        username: admin.username,
        role: "admin",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      { message: "Login berhasil", token },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ADMIN LOGIN ERROR:", error);

    // DEBUG: Inspect the actual env var seen by the code
    const dbUrl = process.env.DATABASE_URL || "UNDEFINED";
    // Show first 20 chars to identify if there are quotes like '"postgresql://...'
    const maskedDbUrl = dbUrl === "UNDEFINED" ? dbUrl : dbUrl.substring(0, 20) + "...";

    return NextResponse.json(
      {
        message: "Internal server error (DEBUG V2 - CHECKING ENV)",
        debug: {
          errorMsg: error.message || String(error),
          // This is critical: tells us strictly what string node.js received
          seenDbUrlStart: maskedDbUrl,
          envVarLength: dbUrl.length
        }
      },
      { status: 500 }
    );
  }
}
