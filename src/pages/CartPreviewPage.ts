import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPreviewPage extends BasePage {
  readonly previewRoot: Locator;
  readonly proceedButton: Locator;

  constructor(page: Page) {
    super(page);
    this.previewRoot = page.locator('.cart-preview');
    this.proceedButton = page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedButton.click();
  }
}
