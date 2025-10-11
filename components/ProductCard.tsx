import Link from 'next/link'

interface ProductCardProps {
  id: string
  slug: string
  title: string
  priceCents: number
  brand?: string | null
}

export function ProductCard({ id, slug, title, priceCents, brand }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="block group">
      <div className="aspect-square bg-gray-100 rounded-md" />
      <div className="mt-2">
        <div className="text-sm text-gray-600">{brand ?? '—'}</div>
        <div className="font-medium group-hover:underline">{title}</div>
        <div className="text-sm">${(priceCents / 100).toFixed(2)}</div>
      </div>
    </Link>
  )
}
