import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const user = session.user as any;

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        stock: body.stock,
        barcode: body.barcode,
        sku: body.sku,
        hsnCode: body.hsnCode,
        gstRate: body.gstRate || 18,
        shopId: user.shopId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
