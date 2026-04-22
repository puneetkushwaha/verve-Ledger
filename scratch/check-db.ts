import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

async function checkUser() {
  const rawUrl = process.env.DATABASE_URL || "file:dev.db";
  let finalUrl = rawUrl;
  if (rawUrl.startsWith("file:")) {
    const cleanPath = rawUrl.replace("file:", "");
    const absolutePath = path.isAbsolute(cleanPath) 
      ? cleanPath 
      : path.join(process.cwd(), cleanPath);
    finalUrl = `file:${absolutePath}`;
  }

  process.env.DATABASE_URL = finalUrl;
  console.log("Final URL:", finalUrl);

  const adapter = new PrismaLibSql({ url: finalUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany({
      select: { email: true, role: true }
    });
    console.log("Existing Users:", JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
