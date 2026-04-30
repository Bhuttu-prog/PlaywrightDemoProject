import { test, expect } from '../src/fixtures/pages';
import { testData } from '../src/utils/testData';

test.describe('GreenKart products', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.gotoHome();
  });

  test('shows Brocolli on home', async ({ productsPage }) => {
    await expect(productsPage.productCard(testData.products.broccoli)).toBeVisible();
  });

  test('search filters catalogue', async ({ productsPage }) => {
    await productsPage.searchProduct(testData.search.tomatoPrefix);
    await expect(productsPage.productCard(testData.products.tomato)).toBeVisible();
    await expect(productsPage.productCard(testData.products.broccoli)).toHaveCount(0);
  });

  test('add to cart increases badge', async ({ productsPage }) => {
    await productsPage.addToCart(testData.products.broccoli, testData.quantities.multi);
    await expect.poll(async () => productsPage.cartItemCount()).toBeGreaterThan(0);
  });

  test('listed price matches catalogue for Brocolli', async ({ productsPage }) => {
    await expect(await productsPage.listedPrice(testData.products.broccoli)).toBe(
      testData.prices.broccoli,
    );
  });
});
