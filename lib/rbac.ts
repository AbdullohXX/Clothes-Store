import { auth } from '@/lib/auth'

export async function requireRole(roles: Array<'CUSTOMER'|'SELLER'|'ADMIN'>) {
  const session = await auth()
  const role = (session?.user as any)?.role ?? 'CUSTOMER'
  if (!session || !roles.includes(role)) {
    return { authorized: false as const, session: null as any }
  }
  return { authorized: true as const, session }
}
