import type { ReactNode } from 'react'

export interface AdminLayoutProps {
  title: string
  children: ReactNode
  actions?: ReactNode
}

export function AdminLayout({ title, children, actions }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          </div>

          <nav aria-label="Admin navigation" className="flex items-center gap-2 text-sm">
            <a href="/admin" className="rounded-md px-3 py-2 text-foreground hover:bg-muted">Dashboard</a>
            <a href="/admin/products" className="rounded-md px-3 py-2 text-foreground hover:bg-muted">Products</a>
            <a href="/admin/orders" className="rounded-md px-3 py-2 text-foreground hover:bg-muted">Orders</a>
            <a href="/admin/reports" className="rounded-md px-3 py-2 text-foreground hover:bg-muted">Reports</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {actions && <div className="mb-6 flex items-center justify-end">{actions}</div>}
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
