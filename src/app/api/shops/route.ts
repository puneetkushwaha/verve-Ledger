import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/shops — returns the current owner's shop(s)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    if (user.role === "ADMIN") {
      // Admin sees all shops
      const shops = await prisma.shop.findMany({
        include: {
          _count: {
            select: { products: true, invoices: true, users: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(shops);
    }

    // Owner / Staff sees only their own shop
    if (!user.shopId) {
      return NextResponse.json([], { status: 200 });
    }

    const shop = await prisma.shop.findUnique({
      where: { id: user.shopId },
      include: {
        _count: {
          select: { products: true, invoices: true, users: true }
        }
      }
    });

    return NextResponse.json(shop ? [shop] : []);
  } catch (error) {
    console.error("Failed to fetch shops:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
