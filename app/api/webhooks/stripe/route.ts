import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!webhookSecret || !stripeSecret) return NextResponse.json({ received: true })

  const raw = await req.text()
  const signature = req.headers.get('stripe-signature') as string
  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-09-30.acacia' as any })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // TODO: fulfill order persistence based on event.type

  return NextResponse.json({ received: true })
}
