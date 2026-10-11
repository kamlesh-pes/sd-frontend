import type { ReactNode } from 'react'
import ProductManagementPage from './products'
import AdminLayout from './Layout'

export interface AdminRouteProps {
  isAdmin?: boolean
  children?: ReactNode
  fallback?: ReactNode
}

export function AdminAccessDenied() {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-left">
      <p className="text-sm font-medium uppercase tracking-[0.12em] text-destructive">Access denied</p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground">Admin access required</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This area is for authorized administrators only. Backend authorization remains the final enforcement point.
      </p>
      <a className="mt-4 inline-block text-sm text-primary underline" href="/">
        Return to products
      </a>
    </div>
  )
}

export function AdminRoute({ isAdmin = false, children, fallback }: AdminRouteProps) {
  if (!isAdmin) {
    return <>{fallback ?? <AdminAccessDenied />}</>
  }

  return <>{children}</>
}

export interface AdminDashboardProps {
  title?: string
  stats?: Array<{ label: string; value: string }>
}

export function AdminDashboardPage({ title = 'Admin dashboard', stats = [] }: AdminDashboardProps) {
  return (
    <AdminLayout title={title}>
      {stats.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Dashboard data is not connected yet.</p>
      )}
    </AdminLayout>
  )
}

export const adminRoutes = [
  { path: '/admin', label: 'Dashboard', element: <AdminDashboardPage /> },
  { path: '/admin/products', label: 'Products', element: <ProductManagementPage /> },
  { path: '/admin/orders', label: 'Orders', element: <AdminDashboardPage title="Orders" /> },
  { path: '/admin/reports', label: 'Reports', element: <AdminDashboardPage title="Reports" /> },
]

export { AdminLayout }
export default AdminDashboardPage
