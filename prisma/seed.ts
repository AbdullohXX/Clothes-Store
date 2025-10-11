import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

async function main() {
  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Admin', password: await bcrypt.hash('Admin1234!', 10), role: 'ADMIN' }
  })

  const sellers = await Promise.all(
    Array.from({ length: 5 }).map(async (_, i) => {
      const u = await prisma.user.create({ data: { email: `seller${i+1}@example.com`, name: `Seller ${i+1}`, password: await bcrypt.hash('Seller1234!', 10), role: 'SELLER' } })
      const s = await prisma.seller.create({ data: { userId: u.id, storeName: `Store ${i+1}`, slug: `store-${i+1}`, verified: i % 2 === 0, onboardingStatus: 'APPROVED' } })
      return s
    })
  )

  const categories = await prisma.$transaction([
    prisma.category.upsert({ where: { slug: 'tops' }, update: {}, create: { slug: 'tops', name: 'Tops' } }),
    prisma.category.upsert({ where: { slug: 'bottoms' }, update: {}, create: { slug: 'bottoms', name: 'Bottoms' } }),
    prisma.category.upsert({ where: { slug: 'outerwear' }, update: {}, create: { slug: 'outerwear', name: 'Outerwear' } }),
  ])

  // Products
  const categoryIds = categories.map(c => c.id)

  for (let i = 1; i <= 30; i++) {
    const seller = sellers[i % sellers.length]
    const categoryId = categoryIds[i % categoryIds.length]
    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        title: `Product ${i}`,
        slug: `product-${i}`,
        description: 'High-quality garment with exceptional fit and style.',
        priceCents: 1999 + (i % 5) * 500,
        sku: `SKU-${i}`,
        inventory: 50 + i,
        brand: i % 2 === 0 ? 'Acme' : 'Contoso',
        categoryId
      }
    })

    await prisma.productImage.createMany({ data: [
      { productId: product.id, url: `https://images.unsplash.com/photo-1520975940471-ae3114cb3a56?auto=format&fit=crop&w=1200&q=60`, position: 0 },
    ]})

    await prisma.variant.createMany({ data: [
      { productId: product.id, size: 'S', color: 'black', inventory: 10, priceDelta: 0 },
      { productId: product.id, size: 'M', color: 'black', inventory: 12, priceDelta: 0 },
      { productId: product.id, size: 'L', color: 'white', inventory: 8, priceDelta: 200 },
    ]})
  }

  // Sample customer and orders
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: { email: 'customer@example.com', name: 'Customer', password: await bcrypt.hash('Customer1234!', 10), role: 'CUSTOMER' }
  })

  const addr = await prisma.address.create({ data: {
    userId: customer.id,
    line1: '123 Main St',
    city: 'Metropolis',
    state: 'CA',
    postal: '94016',
    country: 'US',
    isDefault: true
  }})

  const products = await prisma.product.findMany({ take: 3 })
  for (let j = 1; j <= 5; j++) {
    const order = await prisma.order.create({ data: {
      userId: customer.id,
      totalCents: products.reduce((sum, p) => sum + p.priceCents, 0),
      status: j % 2 === 0 ? 'PAID' : 'PENDING',
      shippingAddressId: addr.id
    }})
    await prisma.orderItem.createMany({ data: products.map(p => ({ orderId: order.id, productId: p.id, priceCents: p.priceCents, quantity: 1 })) })
  }
}

main().then(() => {
  console.log('Seed complete')
}).catch((e) => {
  console.error(e)
  process.exit(1)
})
