import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 1. Create a Shop
    const shop = await prisma.shop.upsert({
      where: { email: "admin@vibetech.com" },
      update: {},
      create: {
        name: "Vibe Premium Store",
        email: "admin@vibetech.com",
        address: "Hazratganj, Lucknow",
        phone: "+91 98765 43210",
        gstin: "09AAACH7409R1ZZ",
        settings: {
          create: {
            invoicePrefix: "VIBE",
            currency: "INR"
          }
        }
      },
    });

    // 2. Create an Admin User
    await prisma.user.upsert({
      where: { email: "admin@vibetech.com" },
      update: {},
      create: {
        name: "Aryan Sharma",
        email: "admin@vibetech.com",
        password: hashedPassword,
        role: "OWNER",
        shopId: shop.id,
      },
    });

    // 3. Create some products
    const products = [
      { name: "Wireless Mouse", price: 1200, stock: 45, barcode: "123456", hsnCode: "8471", shopId: shop.id },
      { name: "Mechanical Keyboard", price: 3500, stock: 12, barcode: "234567", hsnCode: "8471", shopId: shop.id },
      { name: "USB-C Hub", price: 850, stock: 60, barcode: "345678", hsnCode: "8471", shopId: shop.id },
    ];

    for (const p of products) {
      await prisma.product.create({ data: p });
    }

    return NextResponse.json({ message: "Database Seeded Successfully!", email: "admin@vibetech.com", password: "admin123" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
