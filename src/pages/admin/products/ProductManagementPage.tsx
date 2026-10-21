import { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { ProductForm, type ProductFormValues } from '../../../components/admin/ProductForm'
import CatalogNameForm from '../../../components/admin/CatalogNameForm'
import {
  createAdminCatalogItem,
  listAdminCatalog,
  type CatalogItem,
  type CatalogNameRequest,
} from '../../../lib/api/admin/catalog'
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
  const [categories, setCategories] = useState<CatalogItem[]>([])
  const [brands, setBrands] = useState<CatalogItem[]>([])
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [catalogMessage, setCatalogMessage] = useState<string | null>(null)

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
    void Promise.all([listAdminCatalog('categories'), listAdminCatalog('brands')])
      .then(([loadedCategories, loadedBrands]) => {
        setCategories(loadedCategories)
        setBrands(loadedBrands)
      })
      .catch((loadError: unknown) => {
        setCatalogError(loadError instanceof Error ? loadError.message : 'Unable to load categories and brands.')
      })
  }, [])

  const createCatalogItem = async (
    type: 'categories' | 'brands',
    request: CatalogNameRequest
  ) => {
    try {
      const created = await createAdminCatalogItem(type, request)
      if (type === 'categories') {
        setCategories((current) => [...current, created])
      } else {
        setBrands((current) => [...current, created])
      }
      setCatalogError(null)
      setCatalogMessage(`${type === 'categories' ? 'Category' : 'Brand'} created.`)
      return true
    } catch (submitError) {
      setCatalogError(submitError instanceof Error ? submitError.message : 'Unable to create catalog item.')
      setCatalogMessage(null)
      return false
    }
  }

  const createOrUpdateProduct = async (values: ProductFormValues) => {
    try {
      if (values.id) {
        const payload = {
          name: values.name,
          sku: values.sku,
          brand: brands.find((brand) => brand.id === values.brandId)?.name ?? '',
          category: categories.find((category) => category.id === values.categoryId)?.name ?? '',
          description: values.description,
          price: values.price,
          stock: Number(values.stock || 0),
          discount: Number(values.discount ?? 0),
        }
        const updated = await updateAdminProduct(values.id, payload)
        setProducts((current) =>
          current.map((product) => (product.id === updated.id ? { ...product, ...updated } : product))
        )
      } else {
        const payload = {
          sku: values.sku?.trim() ?? '',
          name: values.name.trim(),
          description: values.description?.trim() ?? '',
          categoryId: values.categoryId,
          brandId: values.brandId,
          basePrice: Number(values.price),
          stock: Number(values.stock || 0),
          ...(Number(values.discount ?? 0) > 0
            ? { discountType: 'PERCENTAGE' as const, discountValue: Number(values.discount) }
            : {}),
          active: true,
        }
        const created = await createAdminProduct(payload, values.image)
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
        <section aria-label="Catalog setup" className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Catalog setup</h2>
            <p className="text-sm text-muted-foreground">
              Create categories and brands, then select them when creating a product.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <CatalogNameForm
              title="Category"
              nameLabel="Category name"
              onSubmit={(request) => createCatalogItem('categories', request)}
            />
            <CatalogNameForm
              title="Brand"
              nameLabel="Brand name"
              onSubmit={(request) => createCatalogItem('brands', request)}
            />
          </div>
          {catalogError && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {catalogError}
            </p>
          )}
          {catalogMessage && <p role="status" className="text-sm text-muted-foreground">{catalogMessage}</p>}
        </section>

        {(isCreating || selectedProduct) && (
          <ProductForm
            mode={selectedProduct ? 'edit' : 'create'}
            categories={categories}
            brands={brands}
            initialValues={
              selectedProduct
                ? {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    sku: selectedProduct.sku ?? '',
                    brandId: selectedProduct.brandId && typeof selectedProduct.brandId === 'string'
                      ? selectedProduct.brandId
                      : brands.find((brand) => brand.name === selectedProduct.brand)?.id ?? '',
                    categoryId: selectedProduct.categoryId && typeof selectedProduct.categoryId === 'string'
                      ? selectedProduct.categoryId
                      : categories.find((category) => category.name === selectedProduct.category)?.id ?? '',
                    description: selectedProduct.description ?? '',
                    price: String(selectedProduct.price ?? '0'),
                    stock: String(selectedProduct.stock ?? 0),
                    discount: String(selectedProduct.discount ?? 0),
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
            ) : error ? (
              <p className="text-sm text-muted-foreground">Inventory is unavailable until the request succeeds.</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products found.</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand ?? brands.find((brand) => brand.id === product.brandId)?.name ?? 'No brand'} ·{' '}
                        {product.category ?? categories.find((category) => category.id === product.categoryId)?.name ?? 'uncategorized'} ·{' '}
                        {product.sku ?? 'n/a'}
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
