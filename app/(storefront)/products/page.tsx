import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: true, seller: true, category: true },
    orderBy: { createdAt: 'desc' },
    take: 24
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Latest products</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <li key={p.id} className="group">
            <Link href={`/products/${p.slug}`} className="block">
              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden" />
              <div className="mt-2">
                <div className="text-sm text-gray-600">{p.brand ?? p.category.name}</div>
                <div className="font-medium group-hover:underline">{p.title}</div>
                <div className="text-sm">${(p.priceCents / 100).toFixed(2)}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
