import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card, { CardBody, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import type { CatalogItem } from '../../lib/api/admin/catalog'

export interface ProductFormValues {
  id?: string
  name: string
  sku?: string
  brandId: string
  categoryId: string
  description?: string
  price: string
  stock: string
  discount?: string
  image?: File | null
}

export interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  brands: CatalogItem[]
  categories: CatalogItem[]
  // The callback's values parameter is part of this component's public TypeScript API.
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (values: ProductFormValues) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  mode?: 'create' | 'edit'
}

const emptyValues: ProductFormValues = {
  name: '',
  sku: '',
  brandId: '',
  categoryId: '',
  description: '',
  price: '',
  stock: '0',
  discount: '0',
}

export function ProductForm({
  initialValues,
  brands,
  categories,
  onSubmit,
  onCancel,
  submitLabel = 'Save product',
  mode = 'create',
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setValues({ ...emptyValues, ...initialValues })
    setImageFile(null)
  }, [initialValues])

  const updateField = (field: keyof ProductFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof ProductFormValues, string>> = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!values.sku?.trim()) {
      nextErrors.sku = 'SKU is required.'
    }

    if (!values.description?.trim()) {
      nextErrors.description = 'Description is required.'
    }

    if (!values.price.trim()) {
      nextErrors.price = 'Price is required.'
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.price) || Number(values.price) < 0.01 || Number(values.price) > 99999999.99) {
      nextErrors.price = 'Enter a price from 0.01 to 99999999.99 with at most 2 decimal places.'
    }

    if (!values.categoryId) {
      nextErrors.categoryId = 'Category is required.'
    }

    if (!values.brandId) {
      nextErrors.brandId = 'Brand is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit?.({ ...values, image: imageFile, name: values.name.trim() })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create product' : 'Edit product'}</CardTitle>
        <CardDescription>
          Manage product details, stock levels, and discount settings.
        </CardDescription>
      </CardHeader>

      <CardBody>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="product-name"
              label="Name"
              maxLength={200}
              required
              value={values.name}
              onChange={(event) => updateField('name', event.target.value)}
              error={errors.name}
              placeholder="Laptop Pro"
            />

            <Input
              id="product-sku"
              label="SKU"
              maxLength={64}
              required
              error={errors.sku}
              value={values.sku ?? ''}
              onChange={(event) => updateField('sku', event.target.value)}
              placeholder="SKU-1001"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label htmlFor="product-brand" className="mb-2 text-sm font-medium text-foreground">
                Brand
              </label>
              <select
                id="product-brand"
                className={`px-3 py-2 rounded-md border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.brandId ? 'border-destructive' : ''}`}
                value={values.brandId}
                onChange={(event) => updateField('brandId', event.target.value)}
                required
                disabled={brands.length === 0}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {errors.brandId && <p className="mt-1 text-sm text-destructive">{errors.brandId}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="product-category" className="mb-2 text-sm font-medium text-foreground">
                Category
              </label>
              <select
                id="product-category"
                className={`px-3 py-2 rounded-md border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.categoryId ? 'border-destructive' : ''}`}
                value={values.categoryId}
                onChange={(event) => updateField('categoryId', event.target.value)}
                required
                disabled={categories.length === 0}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-destructive">{errors.categoryId}</p>}
            </div>
          </div>

          <Input
            id="product-description"
            label="Description"
            required
            error={errors.description}
            value={values.description ?? ''}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Detailed product description"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id="product-price"
              label="Price"
              type="number"
              min="0.01"
              max="99999999.99"
              step="0.01"
              required
              value={values.price}
              onChange={(event) => updateField('price', event.target.value)}
              error={errors.price}
              placeholder="999.00"
            />

            <Input
              id="product-stock"
              label="Stock"
              type="number"
              min="0"
              value={values.stock}
              onChange={(event) => updateField('stock', event.target.value)}
            />

            <Input
              id="product-discount"
              label="Discount (%)"
              type="number"
              min="0"
              max="100"
              value={values.discount ?? '0'}
              onChange={(event) => updateField('discount', event.target.value)}
            />
          </div>

          {mode === 'create' && (
            <div className="flex flex-col">
              <label htmlFor="product-image" className="mb-2 text-sm font-medium text-foreground">
                Product image
              </label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1 file:text-foreground"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
              {imageFile && (
                <p className="mt-1 text-sm text-muted-foreground">{imageFile.name}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export default ProductForm
