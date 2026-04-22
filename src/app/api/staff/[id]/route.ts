import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const { id: staffId } = await params;

  try {
    // Make sure the staff member belongs to this owner's shop
    const staff = await prisma.user.findUnique({
      where: { id: staffId }
    });

    if (!staff || staff.shopId !== user.shopId) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    if (staff.role === "OWNER") {
      return NextResponse.json({ error: "Cannot delete owner account" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: staffId }
    });

    return NextResponse.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Failed to delete staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
