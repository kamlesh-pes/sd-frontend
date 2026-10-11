import React, { useEffect, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import ProductsPage from './pages/ProductsPage'
import { adminRoutes } from './pages/admin'
import AdminAccessGate from './pages/admin/AdminAccessGate'
import LoginPage from './pages/LoginPage'
import { queryClient } from './lib/queryClient'
import { authSessionChangeEvent, getSession } from './lib/auth/session'

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/')
  const [, setAuthRevision] = useState(0)

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname.replace(/\/+$/, '') || '/')
    window.addEventListener('popstate', updatePathname)
    const updateAuth = () => setAuthRevision((revision) => revision + 1)
    window.addEventListener(authSessionChangeEvent, updateAuth)
    return () => {
      window.removeEventListener('popstate', updatePathname)
      window.removeEventListener(authSessionChangeEvent, updateAuth)
    }
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(window.location.pathname.replace(/\/+$/, '') || '/')
  }

  const adminRoute = adminRoutes.find((route) => route.path === pathname)
  const session = getSession()

  return (
    <QueryClientProvider client={queryClient}>
      {pathname === '/login' ? (
        <LoginPage
          returnPath={new URLSearchParams(window.location.search).get('returnTo')}
          onLoginSuccess={navigate}
        />
      ) : adminRoute ? (
        session.isAuthenticated ? (
          <AdminAccessGate key={session.accessToken}>{adminRoute.element}</AdminAccessGate>
        ) : (
          <main className="p-6">
            <a
              className="text-sm text-primary underline"
              href={`/login?returnTo=${encodeURIComponent(pathname)}`}
            >
              Log in to continue
            </a>
          </main>
        )
      ) : pathname === '/' ? (
        <ProductsPage />
      ) : (
        <main className="mx-auto max-w-6xl p-6">
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <a className="mt-4 inline-block text-primary underline" href="/">
            Return to products
          </a>
        </main>
      )}
    </QueryClientProvider>
  )
}
