import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = session.user as any;
    const { id } = await params;

    // Verify product belongs to shop
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.shopId !== user.shopId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = session.user as any;
    const { id } = await params;
    const body = await req.json();

    // Verify product belongs to shop
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.shopId !== user.shopId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: parseFloat(body.price),
        stock: parseInt(body.stock),
        category: body.category,
        barcode: body.barcode,
        hsnCode: body.hsnCode,
        gstRate: parseFloat(body.gstRate),
      } as any,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
