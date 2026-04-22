import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    const staff = await prisma.user.findMany({
      where: { 
        shopId: user.shopId,
        role: { in: ["OWNER", "STAFF"] }
      },
      orderBy: { role: "asc" }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "OWNER") {
    return NextResponse.json({ error: "Only Shop Owners can add staff" }, { status: 403 });
  }

  const user = session.user as any;

  try {
    const body = await req.json();
    const { name, email, password } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STAFF",
        shopId: user.shopId
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Failed to create staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
