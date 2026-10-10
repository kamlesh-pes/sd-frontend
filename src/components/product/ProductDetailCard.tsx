import type { Product } from '../../lib/api/products'

interface ProductDetailCardProps {
  product: Product | null
  isLoading?: boolean
  onAddToCart?: () => void
  isPending?: boolean
}

export function ProductDetailCard({
  product,
  isLoading = false,
  onAddToCart,
  isPending = false,
}: ProductDetailCardProps) {
  if (isLoading || !product) {
    return <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading product...</div>
  }

  const price = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price ?? '$0.00'

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="h-80 rounded-lg bg-muted" aria-label={`${product.name} image`} />

        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{product.category ?? 'Uncategorized'}</p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{product.brand ?? 'Unknown brand'}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-2xl font-semibold text-foreground">{price}</span>
            <span className="text-sm text-muted-foreground">{product.stock ?? 0} in stock</span>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            {product.description ?? 'No description available for this product.'}
          </p>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={isPending || (typeof product.stock === 'number' && product.stock <= 0)}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
