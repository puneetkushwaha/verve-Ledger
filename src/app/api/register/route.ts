import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { shopName, ownerName, email, password, phone } = await req.json();

    if (!email || !password || !shopName || !ownerName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // For MongoDB, if not on a replica set, standard transactions might fail.
    // We'll use sequential operations for maximum reliability in dev.
    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 5);

    const shop = await prisma.shop.create({
      data: {
        name: shopName,
        email: email,
        phone: phone,
        plan: "TRIAL",
        planExpiry: trialExpiry,
        settings: {
          create: {
            invoicePrefix: "INV",
            currency: "INR"
          }
        }
      },
    });


    await prisma.user.create({
      data: {
        name: ownerName,
        email: email,
        password: hashedPassword,
        role: "OWNER",
        shopId: shop.id,
      },
    });

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
