import { defineConfig, devices } from '@playwright/test';
import { urls } from './src/config/urls';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : 2,
  reporter: [['allure-playwright', { resultsDir: 'allure-results' }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: urls.home,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    },
    {
      name: 'android-pixel-5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'android-pixel-6',
      use: { ...devices['Pixel 6'] },
    },
    {
      name: 'android-pixel-7',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'android-galaxy-s9',
      use: { ...devices['Galaxy S9+'] },
    },
    {
      name: 'ios-iphone-12',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'ios-iphone-13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'ios-iphone-14',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'ios-iphone-15',
      use: { ...devices['iPhone 15'] },
    },
  ],
});
