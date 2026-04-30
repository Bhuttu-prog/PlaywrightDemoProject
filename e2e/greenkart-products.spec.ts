import { test, expect } from '../src/fixtures/pages';

test.describe('GreenKart products', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.gotoHome();
  });

  test('shows Brocolli on home', async ({ productsPage }) => {
    await expect(productsPage.productCard('Brocolli')).toBeVisible();
  });

  test('search filters catalogue', async ({ productsPage }) => {
    await productsPage.searchProduct('Tom');
    await expect(productsPage.productCard('Tomato')).toBeVisible();
    await expect(productsPage.productCard('Brocolli')).toHaveCount(0);
  });

  test('add to cart increases badge', async ({ productsPage }) => {
    await productsPage.addToCart('Brocolli', 2);
    await expect.poll(async () => productsPage.cartItemCount()).toBeGreaterThan(0);
  });
});
