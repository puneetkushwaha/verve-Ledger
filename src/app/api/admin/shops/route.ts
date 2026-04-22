import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const shops = await prisma.shop.findMany({
      include: {
        _count: {
          select: {
            products: true,
            invoices: true,
            users: true
          }
        },
        settings: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(shops);
  } catch (error) {
    console.error("Failed to fetch shops:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
