import { test, expect } from '../src/fixtures/pages';

test.describe('GreenKart checkout', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.gotoHome();
  });

  test('proceed to checkout lists items', async ({
    productsPage,
    cartPreviewPage,
    checkoutPage,
  }) => {
    await productsPage.addToCart('Tomato', 1);
    await productsPage.openCartPreview();
    await cartPreviewPage.proceedToCheckout();
    await expect(checkoutPage.productNames.first()).toBeVisible();
  });

  test('invalid promo shows feedback', async ({
    productsPage,
    cartPreviewPage,
    checkoutPage,
  }) => {
    await productsPage.addToCart('Beans', 1);
    await productsPage.openCartPreview();
    await cartPreviewPage.proceedToCheckout();
    await checkoutPage.applyPromo('INVALID');
    await expect(checkoutPage.promoMessage).toBeVisible();
    await expect(checkoutPage.promoMessage).not.toHaveText('');
  });
});
