import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR' } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency,
      receipt: `receipt_${crypto.randomUUID().substring(0, 8)}`,
      notes: {
        shopId: body.shopId,
        planId: body.planId,
      }
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
