import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
          take: 10
        },
        invoices: {
          include: { customer: true },
          orderBy: { createdAt: "desc" },
          take: 10
        },
        users: true,
        _count: {
          select: {
            products: true,
            invoices: true,
            users: true
          }
        }
      }
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("Failed to fetch shop details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
