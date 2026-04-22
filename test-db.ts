import "dotenv/config";
import { PrismaClient } from "./node_modules/@prisma/client";
import { PrismaLibSql } from "./node_modules/@prisma/adapter-libsql";
import path from "path";

async function test() {
  const rawUrl = process.env.DATABASE_URL || "file:dev.db";
  const cleanPath = rawUrl.replace("file:", "");
  const absolutePath = path.isAbsolute(cleanPath) ? cleanPath : path.join(process.cwd(), cleanPath);
  const finalUrl = `file:${absolutePath}`;
  
  console.log("Testing with URL:", finalUrl);

  const adapter = new PrismaLibSql({
    url: finalUrl,
  });
  
  const prisma = new PrismaClient({ adapter });

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
