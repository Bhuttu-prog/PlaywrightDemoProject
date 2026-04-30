import type { Page } from '@playwright/test';
import { urls } from '../config/urls';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async gotoHome(): Promise<void> {
    await this.page.goto(urls.home);
  }
}
