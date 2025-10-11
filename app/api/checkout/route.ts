import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const Body = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })).min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
})

export async function POST(req: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-09-30.acacia' as any })

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const { items, successUrl, cancelUrl } = parsed.data
  const products = await prisma.product.findMany({ where: { id: { in: items.map(i => i.productId) } } })

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(it => {
    const p = products.find(pp => pp.id === it.productId)!
    return {
      quantity: it.quantity,
      price_data: {
        currency: 'usd',
        product_data: { name: p.title },
        unit_amount: p.priceCents
      }
    }
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return NextResponse.json({ id: session.id, url: session.url })
}
