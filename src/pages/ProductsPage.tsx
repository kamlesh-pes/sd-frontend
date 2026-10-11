import { useAppStore } from '../state/store'
import { useSearch } from '../hooks/useSearch'
import { useAuth } from '../hooks/useAuth'
import { ProductGrid } from '../components/product/ProductGrid'
import Button from '../components/ui/Button'

export default function ProductsPage() {
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } = useAppStore()
  const { user, isAuthenticated, logout } = useAuth()
  const { products, isLoading, isError, error } = useSearch({
    query: searchQuery,
    category: selectedCategory,
    page: 0,
    size: 20,
  })

  return (
    <section className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">Sahastra Digital</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Products</h1>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{user?.email ?? 'Signed in'}</span>
              <Button variant="secondary" size="sm" onClick={() => void logout()}>
                Log out
              </Button>
            </>
          ) : (
            <a
              className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              href="/login?returnTo=%2F"
            >
              Log in
            </a>
          )}
        </div>

        <div className="flex w-full max-w-xl flex-col gap-3 md:flex-row">
          <label className="flex-1 text-sm font-medium text-muted-foreground">
            <span className="sr-only">Search products</span>
            <input
              aria-label="Search products"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="text-sm font-medium text-muted-foreground">
            <span className="sr-only">Select category</span>
            <select
              aria-label="Select category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All categories</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories</option>
            </select>
          </label>
        </div>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}

      {isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {(error as Error)?.message ?? 'Unable to load products.'}
        </p>
      )}

      {!isLoading && !isError && <ProductGrid products={products} />}
    </section>
  )
}
