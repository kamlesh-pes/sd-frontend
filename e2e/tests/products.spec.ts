import { expect, test } from '@playwright/test'

const catalog = [
  {
    id: 'prod-1',
    name: 'Laptop Pro',
    brand: 'Acme',
    category: 'electronics',
    price: '1499.00',
    stock: 12,
    sku: 'LAP-01',
  },
  {
    id: 'prod-2',
    name: 'Wireless Mouse',
    brand: 'Acme',
    category: 'accessories',
    price: '39.99',
    stock: 32,
    sku: 'MOU-02',
  },
]

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/products**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: catalog,
        page: 0,
        size: 20,
        totalPages: 1,
        total: catalog.length,
      }),
    })
  })

  await page.route('**/api/v1/search**', async (route) => {
    const url = new URL(route.request().url())
    const query = url.searchParams.get('q')?.toLowerCase() ?? ''

    const matches = catalog.filter((product) => product.name.toLowerCase().includes(query))

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: matches,
        page: 0,
        size: 20,
        totalPages: 1,
        total: matches.length,
      }),
    })
  })
})

test('guest user can browse the product catalog', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible()
  await expect(page.getByText('Laptop Pro')).toBeVisible()
  await expect(page.getByText('Wireless Mouse')).toBeVisible()
})

test('guest user can search for a product by name', async ({ page }) => {
  await page.goto('/')

  const searchInput = page.getByLabel('Search products')
  await searchInput.fill('mouse')

  await expect(page.getByText('Laptop Pro')).not.toBeVisible()
  await expect(page.getByText('Wireless Mouse')).toBeVisible()
})
