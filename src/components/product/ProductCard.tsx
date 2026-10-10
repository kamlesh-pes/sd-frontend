import type { Product } from '../../lib/api/products'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const price = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price ?? '$0.00'

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 h-32 rounded-md bg-muted" aria-label={`${product.name} preview`} />
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.category ?? 'Uncategorized'}</p>
      <h3 className="mt-2 text-lg font-semibold text-foreground">{product.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{product.brand ?? 'Unknown brand'}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-base font-medium text-foreground">{price}</span>
        <span className="text-xs text-muted-foreground">{product.stock ?? 0} in stock</span>
      </div>
    </article>
  )
}
