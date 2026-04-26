import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { validateSubscription } from "@/lib/subscription";

// GET /api/invoices — fetch all invoices for the current shop
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    const where = user.role === "ADMIN" 
      ? {} 
      : { shopId: user.shopId };

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: { product: true }
        },
        user: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items, customerId, totalAmount, taxAmount, discount, paymentMode } = await req.json();
    const user = session.user as any;

    // Validate Subscription & Ownership
    const validation = await validateSubscription(user.shopId);
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: validation.status });
    }

    // Create Invoice in a transaction to update stock
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get next invoice number
      const settings = await tx.setting.findUnique({
        where: { shopId: user.shopId }
      });

      const invoiceNum = `${settings?.invoicePrefix || "INV"}-${(settings?.invoiceNextNumber || 1).toString().padStart(4, "0")}`;

      // 2. Create Invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber: invoiceNum,
          totalAmount,
          taxAmount,
          discount,
          paymentMode,
          shopId: user.shopId,
          userId: user.id,
          customerId: customerId,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              gstRate: item.gstRate || 18,
              gstAmount: (item.price * item.quantity) * (item.gstRate || 18) / 100,
              total: item.price * item.quantity
            }))
          }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      // 3. Update stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 4. Increment invoice number
      await tx.setting.update({
        where: { shopId: user.shopId },
        data: {
          invoiceNextNumber: {
            increment: 1
          }
        }
      });

      return invoice;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}

