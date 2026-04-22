import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { email: true, role: true }
    });
    
    return NextResponse.json({ 
      success: true, 
      databaseUrl: process.env.DATABASE_URL,
      userCount,
      users 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta
    }, { status: 500 });
  }
}
