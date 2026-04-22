import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Razorpay Webhook Event:', event.event);

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const { notes } = event.payload.payment?.entity || event.payload.order?.entity || {};
      const { shopId, planId } = notes || {};

      if (shopId && planId) {
        let expiryDate = new Date();
        if (planId === 'MONTHLY') {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (planId === 'YEARLY') {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        await prisma.shop.update({
          where: { id: shopId },
          data: {
            plan: planId,
            planExpiry: expiryDate,
          },
        });

        console.log(`Updated shop ${shopId} to plan ${planId}`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
