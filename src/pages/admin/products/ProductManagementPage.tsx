import { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { ProductForm, type ProductFormValues } from '../../../components/admin/ProductForm'
import {
  createAdminProduct,
  deleteAdminProduct,
  listAdminProducts,
  updateAdminProduct,
  updateProductDiscount,
  updateProductStock,
  type AdminProduct,
} from '../../../lib/api/admin/products'
import AdminLayout from '../Layout'

export function ProductManagementPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId]
  )

  const loadProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await listAdminProducts()
      setProducts(data.items)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load products.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const createOrUpdateProduct = async (values: ProductFormValues) => {
    const payload = {
      id: values.id,
      name: values.name,
      sku: values.sku,
      brand: values.brand,
      category: values.category,
      description: values.description,
      price: values.price,
      stock: Number(values.stock || 0),
      discount: Number(values.discount ?? 0),
      imageUrl: values.imageUrl,
    }

    try {
      if (values.id) {
        const updated = await updateAdminProduct(values.id, payload)
        setProducts((current) =>
          current.map((product) => (product.id === updated.id ? { ...product, ...updated } : product))
        )
      } else {
        const created = await createAdminProduct(payload)
        setProducts((current) => [created, ...current])
      }

      setSelectedProductId(null)
      setIsCreating(false)
      setError(null)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save product.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminProduct(id)
      setProducts((current) => current.filter((product) => product.id !== id))
      if (selectedProductId === id) {
        setSelectedProductId(null)
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to delete product.')
    }
  }

  const handleStockUpdate = async (id: string, stock: number) => {
    try {
      const updated = await updateProductStock(id, stock)
      setProducts((current) => current.map((product) => (product.id === updated.id ? { ...product, ...updated } : product)))
      setError(null)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update stock.')
    }
  }

  const handleDiscountUpdate = async (id: string, discount: number) => {
    try {
      const updated = await updateProductDiscount(id, discount)
      setProducts((current) => current.map((product) => (product.id === updated.id ? { ...product, ...updated } : product)))
      setError(null)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update discount.')
    }
  }

  return (
    <AdminLayout
      title="Products"
      actions={
        <Button onClick={() => {
          setIsCreating(true)
          setSelectedProductId(null)
        }}>
          Add product
        </Button>
      }
    >
      <div className="space-y-6">
        {(isCreating || selectedProduct) && (
          <ProductForm
            mode={selectedProduct ? 'edit' : 'create'}
            initialValues={
              selectedProduct
                ? {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    sku: selectedProduct.sku ?? '',
                    brand: selectedProduct.brand ?? '',
                    category: selectedProduct.category ?? 'electronics',
                    description: selectedProduct.description ?? '',
                    price: String(selectedProduct.price ?? '0'),
                    stock: String(selectedProduct.stock ?? 0),
                    discount: String(selectedProduct.discount ?? 0),
                    imageUrl: selectedProduct.imageUrl ?? '',
                  }
                : undefined
            }
            onSubmit={createOrUpdateProduct}
            onCancel={() => {
              setSelectedProductId(null)
              setIsCreating(false)
            }}
          />
        )}

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products found.</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand ?? 'No brand'} · {product.category ?? 'uncategorized'} · {product.sku ?? 'n/a'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedProductId(product.id)}>
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => void handleStockUpdate(product.id, Number((product.stock ?? 0) + 1))}
                      >
                        + Stock
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => void handleDiscountUpdate(product.id, Number((product.discount ?? 0) + 5))}
                      >
                        + Discount
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => void handleDelete(product.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default ProductManagementPage
