import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const width of [375, 1440]) {
  test(`products page is accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })

    await page.route('**/api/v1/products**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              id: 'prod-1',
              name: 'Laptop Pro',
              brand: 'Acme',
              category: 'electronics',
              price: '1499.00',
              stock: 12,
            },
            {
              id: 'prod-2',
              name: 'Wireless Mouse',
              brand: 'Acme',
              category: 'accessories',
              price: '39.99',
              stock: 24,
            },
          ],
          page: 0,
          size: 20,
          totalPages: 1,
          total: 2,
        }),
      })
    })

    await page.route('**/api/v1/search**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [{
            id: 'prod-2',
            name: 'Wireless Mouse',
            brand: 'Acme',
            category: 'accessories',
            price: '39.99',
            stock: 24,
          }],
          page: 0,
          size: 20,
          totalPages: 1,
          total: 1,
        }),
      })
    })

    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible()
  })
}
