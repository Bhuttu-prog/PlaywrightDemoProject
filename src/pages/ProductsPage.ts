import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/parsePrice';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartIcon: Locator;
  readonly cartPreview: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input.search-keyword');
    this.searchButton = page.locator('button.search-button');
    this.cartIcon = page.locator('img[alt="Cart"]');
    this.cartPreview = page.locator('.cart-preview');
  }

  productCard(productName: string): Locator {
    return this.page.locator('div.product').filter({ hasText: productName }).first();
  }

  async listedPrice(productName: string): Promise<number> {
    const raw = await this.productCard(productName).locator('p.product-price').innerText();
    return parsePrice(raw);
  }

  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async setQuantity(productName: string, quantity: number): Promise<void> {
    const card = this.productCard(productName);
    const current = await card.locator('input.quantity').inputValue().catch(() => '1');
    const target = Math.max(1, quantity);
    let n = Number.parseInt(current, 10) || 1;
    const inc = card.locator('a.increment');
    const dec = card.locator('a.decrement');
    while (n < target) {
      await inc.click();
      n++;
    }
    while (n > target) {
      await dec.click();
      n--;
    }
  }

  async addToCart(productName: string, quantity = 1): Promise<void> {
    await this.setQuantity(productName, quantity);
    await this.productCard(productName).locator('.product-action button').click();
  }

  async openCartPreview(): Promise<void> {
    await this.cartIcon.click();
    await this.cartPreview.waitFor({ state: 'visible' });
  }

  async cartItemCount(): Promise<number> {
    const text = await this.page.locator('.cart-icon .cart-count').innerText();
    return Number.parseInt(text.trim(), 10) || 0;
  }
}
