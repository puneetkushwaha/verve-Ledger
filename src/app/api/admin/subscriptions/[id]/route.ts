import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { months, planType } = await req.json();
    const { id: requestId } = await params;

    // Get the request details
    const request = await prisma.planRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    // Update the shop
    await prisma.shop.update({
      where: { id: request.shopId },
      data: {
        plan: planType || "CUSTOM",
        planExpiry: expiryDate
      }
    });

    // Mark request as APPROVED
    await prisma.planRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" }
    });

    return NextResponse.json({ success: true, expiryDate });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id } = await params;
      await prisma.planRequest.update({
        where: { id },
        data: { status: "REJECTED" }
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Rejection failed" }, { status: 500 });
    }
  }
