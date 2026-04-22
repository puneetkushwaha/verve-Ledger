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
    const { message, phone, shopId, shopName, email } = await req.json();

    // Use any as fallback if types aren't generated yet
    const request = await (prisma as any).planRequest.create({
      data: {
        shopId,
        shopName,
        email,
        phone,
        message,
        status: "PENDING"
      }
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error("Subscription request error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
