import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card, { CardBody, CardDescription, CardHeader, CardTitle } from '../ui/Card'

export interface ProductFormValues {
  id?: string
  name: string
  sku?: string
  brand?: string
  category: string
  description?: string
  price: string
  stock: string
  discount?: string
  imageUrl?: string
}

export interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  onSubmit?: (values: ProductFormValues) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  mode?: 'create' | 'edit'
}

const emptyValues: ProductFormValues = {
  name: '',
  sku: '',
  brand: '',
  category: 'electronics',
  description: '',
  price: '',
  stock: '0',
  discount: '0',
  imageUrl: '',
}

export function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save product',
  mode = 'create',
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setValues({ ...emptyValues, ...initialValues })
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

    if (!values.price.trim()) {
      nextErrors.price = 'Price is required.'
    }

    if (!values.category.trim()) {
      nextErrors.category = 'Category is required.'
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
      await onSubmit?.({ ...values, name: values.name.trim() })
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
              value={values.name}
              onChange={(event) => updateField('name', event.target.value)}
              error={errors.name}
              placeholder="Laptop Pro"
            />

            <Input
              id="product-sku"
              label="SKU"
              value={values.sku ?? ''}
              onChange={(event) => updateField('sku', event.target.value)}
              placeholder="SKU-1001"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="product-brand"
              label="Brand"
              value={values.brand ?? ''}
              onChange={(event) => updateField('brand', event.target.value)}
              placeholder="Acme"
            />

            <Input
              id="product-category"
              label="Category"
              value={values.category}
              onChange={(event) => updateField('category', event.target.value)}
              error={errors.category}
              placeholder="electronics"
            />
          </div>

          <Input
            id="product-description"
            label="Description"
            value={values.description ?? ''}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Detailed product description"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id="product-price"
              label="Price"
              type="number"
              min="0"
              step="0.01"
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

          <Input
            id="product-image-url"
            label="Image URL"
            value={values.imageUrl ?? ''}
            onChange={(event) => updateField('imageUrl', event.target.value)}
            placeholder="https://example.com/image.jpg"
          />

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
