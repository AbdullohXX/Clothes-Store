import Link from 'next/link'
import { requireRole } from '@/lib/rbac'

export default async function AdminDashboardPage() {
  const { authorized } = await requireRole(['ADMIN'])
  if (!authorized) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <p className="text-red-600">Admin access required.</p>
        <Link href="/login" className="underline">Login</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/users" className="border rounded-md p-4 hover:bg-gray-50">Users</Link>
        <Link href="/admin/approvals" className="border rounded-md p-4 hover:bg-gray-50">Seller approvals</Link>
      </div>
    </div>
  )
}
