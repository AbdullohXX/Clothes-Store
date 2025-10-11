import Link from 'next/link'
import { requireRole } from '@/lib/rbac'

export default async function SellerDashboardPage() {
  const { authorized } = await requireRole(['SELLER', 'ADMIN'])
  if (!authorized) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <p className="text-red-600">You must be a seller to view this page.</p>
        <Link href="/login" className="underline">Login</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="text-2xl font-semibold">Seller dashboard</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href="/seller/products" className="border rounded-md p-4 hover:bg-gray-50">Manage products</Link>
        <Link href="/seller/orders" className="border rounded-md p-4 hover:bg-gray-50">Orders</Link>
      </div>
    </div>
  )
}
