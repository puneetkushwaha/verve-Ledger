import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    const shop = await prisma.shop.findUnique({
      where: { id: user.shopId },
      include: { settings: true }
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({
      shopName: shop.name,
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
      invoicePrefix: shop.settings?.invoicePrefix || "INV",
      themeColor: shop.settings?.themeColor || "#00CF64",
      fontFamily: shop.settings?.fontFamily || "Inter",
      terms: shop.settings?.terms || ""
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    const body = await req.json();
    const { shopName, email, phone, address, invoicePrefix, themeColor, fontFamily, terms } = body;

    // Update Shop and Settings in a transaction
    await prisma.$transaction([
      prisma.shop.update({
        where: { id: user.shopId },
        data: {
          name: shopName,
          email,
          phone,
          address
        }
      }),
      prisma.setting.upsert({
        where: { shopId: user.shopId },
        update: {
          invoicePrefix,
          themeColor,
          fontFamily,
          terms
        },
        create: {
          shopId: user.shopId,
          invoicePrefix,
          themeColor,
          fontFamily,
          terms
        }
      })
    ]);

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
