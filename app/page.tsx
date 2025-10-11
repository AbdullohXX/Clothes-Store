import Link from 'next/link'

export default async function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="text-center py-16 bg-gray-50 rounded-lg">
        <h1 className="text-4xl font-bold tracking-tight">Discover your style</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Shop curated collections of clothes with rich filters, fast checkout, and secure payments.</p>
        <div className="mt-6">
          <Link href="/products" className="inline-flex items-center px-5 py-3 rounded-md bg-black text-white">Browse products</Link>
        </div>
      </section>
    </div>
  )
}
