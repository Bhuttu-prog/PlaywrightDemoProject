import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly promoInput: Locator;
  readonly applyPromoButton: Locator;
  readonly promoMessage: Locator;
  readonly placeOrderButton: Locator;
  readonly productNames: Locator;
  readonly discountAmount: Locator;

  constructor(page: Page) {
    super(page);
    this.promoInput = page.locator('input.promoCode');
    this.applyPromoButton = page.locator('button.promoBtn');
    this.promoMessage = page.locator('span.promoInfo');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.productNames = page.locator('p.product-name');
    this.discountAmount = page.locator('.discountAmt');
  }

  async applyPromo(code: string): Promise<void> {
    await this.promoInput.fill(code);
    await this.applyPromoButton.click();
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
