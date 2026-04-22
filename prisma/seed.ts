import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

async function main() {
  const prisma = new PrismaClient();

  console.log("Seeding MongoDB database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@vibetech.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // 1. Create a Shop
  const shop = await prisma.shop.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Verve Ledger Premium",
      email: adminEmail,
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
    where: { email: adminEmail },
    update: {
      password: hashedPassword
    },
    create: {
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
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
    // MongoDB doesn't use upsert for non-unique fields easily without IDs
    // We'll just create them if they don't exist by name
    const existingProduct = await prisma.product.findFirst({
      where: { name: p.name, shopId: shop.id }
    });
    if (!existingProduct) {
      await prisma.product.create({ data: p });
    }
  }

  console.log("Seed data created successfully!");
  console.log("Email:", adminEmail);
  console.log("Password:", adminPassword);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
