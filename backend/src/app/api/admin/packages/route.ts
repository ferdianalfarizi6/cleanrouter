import { NextResponse } from "next/server";
import { Prisma, Package } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic';

//post
export async function POST(req: Request) {
  const user = verifyAdmin(req as any);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  const body = (await req.json()) as {
    serviceType: Package["serviceType"];
    label: string;
    price: number;
  };

  const pkg = await prisma.package.create({
    data: {
      serviceType: body.serviceType,
      label: body.label,
      price: Number(body.price) || 0,
    },
  });

  return NextResponse.json(pkg, { status: 201 });
}


//get
export async function GET(req: Request) {
  const user = verifyAdmin(req as any);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }
  const packages = await prisma.package.findMany();
  return NextResponse.json(packages);
}
