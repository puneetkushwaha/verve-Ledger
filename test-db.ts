import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function test() {
  console.log("Testing DB connection with URL:", process.env.DATABASE_URL?.slice(0, 30) + "...");

  const prisma = new PrismaClient();

  try {
    const count = await prisma.user.count();
    console.log("Connection successful! User count:", count);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
