import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductDetailCard } from '../components/product/ProductDetailCard'
import { apiGet } from '../lib/api/client'
import { products } from '../lib/api/endpoints'
import type { Product } from '../lib/api/products'

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [isPending, setIsPending] = useState(false)

  const { data, isLoading, isError, error } = useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await apiGet<unknown>(products.get(productId))
      const product = (response ?? {}) as Product
      return product
    },
    enabled: Boolean(productId),
    staleTime: 60_000,
  })

  const handleAddToCart = async () => {
    setIsPending(true)

    try {
      await apiGet('/cart')
    } finally {
      setIsPending(false)
    }
  }

  const product = useMemo(() => data ?? null, [data])

  return (
    <section className="mx-auto max-w-5xl p-6">
      {isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {(error as Error)?.message ?? 'Unable to load product.'}
        </p>
      )}

      <ProductDetailCard product={product} isLoading={isLoading} isPending={isPending} onAddToCart={handleAddToCart} />
    </section>
  )
}
