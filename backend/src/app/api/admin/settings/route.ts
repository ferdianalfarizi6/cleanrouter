import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

export async function PUT(req: Request) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await req.json()) as {
            currentPassword?: string;
            newPassword?: string;
        };
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 });
        }

        // Get admin from db
        const dbAdmin = await prisma.admin.findUnique({
            where: { id: admin.id }
        });

        if (!dbAdmin) {
            return NextResponse.json({ message: "Admin tidak ditemukan" }, { status: 404 });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, dbAdmin.password);
        if (!isValid) {
            return NextResponse.json({ message: "Password lama salah" }, { status: 401 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update
        await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: "Password berhasil diperbarui" }, { status: 200 });

    } catch (error) {
        console.error("UPDATE ADMIN ERROR:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
