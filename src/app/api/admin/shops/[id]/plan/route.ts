import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan, expiryMonths, expiryYears } = await req.json();
    const { id } = params;

    // Calculate expiry date
    let planExpiry = new Date();
    if (expiryYears) {
      planExpiry.setFullYear(planExpiry.getFullYear() + parseInt(expiryYears));
    }
    if (expiryMonths) {
      planExpiry.setMonth(planExpiry.getMonth() + parseInt(expiryMonths));
    }

    const updatedShop = await prisma.shop.update({
      where: { id },
      data: {
        plan,
        planExpiry
      }
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error("Failed to update shop plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
