import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props { params: { slug: string } }

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, variants: true, seller: true, reviews: true, category: true }
  })
  if (!product) return notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square bg-gray-100 rounded-md" />
        <div className="mt-3 grid grid-cols-5 gap-2">
          {product.images.slice(0,5).map(img => (
            <div key={img.id} className="aspect-square bg-gray-100 rounded" />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="text-gray-600 mt-1">{product.brand ?? product.category.name}</div>
        <div className="text-xl mt-2">${(product.priceCents / 100).toFixed(2)}</div>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{product.description}</p>
        <form className="mt-6 grid gap-4">
          <div>
            <label className="block text-sm font-medium">Variant</label>
            <select className="mt-1 border rounded-md px-3 py-2 w-full">
              {product.variants.map(v => (
                <option key={v.id} value={v.id}>{v.size} / {v.color} {(v.priceDelta ? `+${(v.priceDelta/100).toFixed(2)}` : '')}</option>
              ))}
            </select>
          </div>
          <button className="rounded-md bg-black text-white px-5 py-3 w-full sm:w-auto">Add to cart</button>
        </form>
      </div>
    </div>
  )
}
