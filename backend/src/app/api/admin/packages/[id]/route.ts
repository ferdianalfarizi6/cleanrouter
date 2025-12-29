import { NextResponse } from "next/server";
import { Prisma, ServiceType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

type Params = {
  params: { id: string };
};

// update
export async function PUT(req: Request, { params }: Params) {
  const user = verifyAdmin(req as any);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  const body = (await req.json()) as {
    label?: string;
    serviceType?: ServiceType;
  };

  if (
    body.serviceType &&
    !Object.values(ServiceType).includes(body.serviceType)
  ) {
    return NextResponse.json(
      { message: "Service type tidak valid" },
      { status: 400 }
    );
  }

  try {
    const pkg = await prisma.package.update({
      where: { id: params.id },
      data: {
        label: body.label,
        serviceType: body.serviceType,
      },
    });

    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json(
      { message: "Package tidak ditemukan" },
      { status: 404 }
    );
  }
}

// delete
export async function DELETE(req: Request, { params }: Params) {
  const user = verifyAdmin(req as any);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  try {
    await prisma.package.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Package berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { message: "Package tidak ditemukan" },
      { status: 404 }
    );
  }
}
