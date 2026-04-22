import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * Validates if the current user has an active subscription or is within trial.
 * Also verifies if the user has access to the requested shop.
 */
export async function validateSubscription(shopId?: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = session.user as any;

  // 1. Role Protection: Only ADMIN can access other shops
  if (shopId && user.role !== "ADMIN" && user.shopId !== shopId) {
    return { error: "Access Denied: You do not own this resource", status: 403 };
  }

  // 2. Admin Bypass: Admins are not restricted by subscription
  if (user.role === "ADMIN") {
    return { authorized: true, user };
  }

  // 3. Subscription Check: Check if plan is active
  const planExpiry = user.planExpiry ? new Date(user.planExpiry) : null;
  const isExpired = planExpiry && planExpiry < new Date();

  if (isExpired) {
    return { 
      error: "Subscription Expired: Access to this operation is locked. Please renew your plan.", 
      status: 402 // Payment Required
    };
  }

  return { authorized: true, user };
}

/**
 * Helper to wrap API handlers with subscription validation
 */
export async function withSubscription(shopId: string | undefined, handler: () => Promise<NextResponse>) {
  const validation = await validateSubscription(shopId);
  
  if (validation.error) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  return handler();
}
