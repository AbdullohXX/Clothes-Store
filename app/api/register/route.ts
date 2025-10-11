import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
})

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const { email, password, name } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, name, password: hashed, role: 'CUSTOMER' } })
  return NextResponse.json({ id: user.id, email: user.email, name: user.name })
}
