import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const QuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  minPrice: z.string().transform(v => (v ? parseInt(v, 10) : undefined)).optional(),
  maxPrice: z.string().transform(v => (v ? parseInt(v, 10) : undefined)).optional(),
  brand: z.string().optional(),
  seller: z.string().optional(),
  rating: z.string().transform(v => (v ? parseInt(v, 10) : undefined)).optional(),
  limit: z.string().transform(v => (v ? parseInt(v, 10) : 24)).optional(),
  page: z.string().transform(v => (v ? parseInt(v, 10) : 1)).optional(),
})

const COLOR_SYNONYMS: Record<string, string[]> = {
  red: ['crimson', 'maroon', 'scarlet', 'burgundy'],
  blue: ['navy', 'azure', 'cobalt'],
  black: ['noir', 'charcoal'],
  white: ['ivory', 'cream']
}

function expandSynonyms(term?: string) {
  if (!term) return []
  const normalized = term.toLowerCase()
  const synonyms = COLOR_SYNONYMS[normalized] ?? []
  return Array.from(new Set([normalized, ...synonyms]))
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
  }
  const { q, category, size, color, minPrice, maxPrice, brand, seller, rating, limit, page } = parsed.data

  const where: any = {}

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } }
    ]
  }

  if (brand) where.brand = { contains: brand, mode: 'insensitive' }
  if (category) where.category = { slug: { equals: category } }
  if (seller) where.seller = { slug: { equals: seller } }

  if (minPrice || maxPrice) where.priceCents = {
    gte: minPrice ?? undefined,
    lte: maxPrice ?? undefined
  }

  if (size) where.variants = { some: { size: { equals: size, mode: 'insensitive' } } }
  if (color) {
    const colors = expandSynonyms(color)
    where.variants = { some: { color: { in: colors, mode: 'insensitive' } } }
  }

  if (rating) where.reviews = { some: { rating: { gte: rating } } }

  const take = Math.min(50, limit ?? 24)
  const skip = ((page ?? 1) - 1) * take

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, reviews: true, category: true, seller: true },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    }),
    prisma.product.count({ where })
  ])

  return NextResponse.json({ items, total, page: page ?? 1, pageSize: take })
}
