import './globals.css'
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Clothes Store',
  description: 'A modern, accessible e-commerce platform for fashion.'
}

export const viewport: Viewport = {
  themeColor: '#111827'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 bg-white/80 backdrop-blur z-10">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">Clothes</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/products" className="hover:underline">Products</Link>
              <Link href="/seller" className="hover:underline">Seller</Link>
              <Link href="/admin" className="hover:underline">Admin</Link>
              <Link href="/login" className="hover:underline">Login</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-500">© {new Date().getFullYear()} Clothes</div>
        </footer>
      </body>
    </html>
  )
}
