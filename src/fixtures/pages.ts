import { test as base } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPreviewPage } from '../pages/CartPreviewPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type Pages = {
  productsPage: ProductsPage;
  cartPreviewPage: CartPreviewPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Pages>({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPreviewPage: async ({ page }, use) => {
    await use(new CartPreviewPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export const expect = test.expect;
