import { test, expect } from '../src/fixtures/pages';
import { testData } from '../src/utils/testData';

test.describe('GreenKart checkout', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.gotoHome();
  });

  test('proceed to checkout lists items', async ({
    productsPage,
    cartPreviewPage,
    checkoutPage,
  }) => {
    await productsPage.addToCart(testData.products.tomato, testData.quantities.single);
    await productsPage.openCartPreview();
    await cartPreviewPage.proceedToCheckout();
    await expect(checkoutPage.productNames.first()).toBeVisible();
  });

  test('invalid promo shows feedback', async ({
    productsPage,
    cartPreviewPage,
    checkoutPage,
  }) => {
    await productsPage.addToCart(testData.products.beans, testData.quantities.single);
    await productsPage.openCartPreview();
    await cartPreviewPage.proceedToCheckout();
    await checkoutPage.applyPromo(testData.promo.invalid);
    await expect(checkoutPage.promoMessage).toBeVisible();
    await expect(checkoutPage.promoMessage).not.toHaveText('');
  });
});
