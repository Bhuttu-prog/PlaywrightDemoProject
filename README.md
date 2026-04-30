# Playwright GreenKart

End-to-end tests for [GreenKart](https://rahulshettyacademy.com/seleniumPractise/#/) (Rahul Shetty Academy practice site), using Playwright, TypeScript, the Page Object Model, custom fixtures, and Allure Report.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

## Setup

```bash
npm install
npx playwright install chromium
```

## Project layout

| Path | Purpose |
|------|---------|
| `e2e/` | Test specs (`*.spec.ts`) |
| `src/config/urls.ts` | Application base URL; override host with `GREENKART_ORIGIN` |
| `src/pages/` | Page objects (selectors and user actions per screen) |
| `src/fixtures/pages.ts` | Extends Playwright `test` to inject `productsPage`, `cartPreviewPage`, `checkoutPage` |
| `playwright.config.ts` | Test directory, timeouts, Chromium project, Allure reporter, shared `use` options |

## Run tests

```bash
npm test
```

Run a single spec file:

```bash
npm run test:products
npm run test:checkout
```

Other useful commands:

```bash
npm run test:ui
npm run test:headed
```

## Allure report

Tests write raw results to `allure-results/`. Generate the HTML report and open it:

```bash
npm test && npm run allure:report
```

Or step by step:

```bash
npm test
npm run allure:generate
npm run allure:open
```

`npm run report` is the same as `npm run allure:report` (generate then open).

## Environment

| Variable | Description |
|----------|-------------|
| `GREENKART_ORIGIN` | Optional. Defaults to `https://rahulshettyacademy.com`. The app path `/seleniumPractise/#/` is appended in `src/config/urls.ts`. |
| `CI` | When set, Playwright uses stricter rules (e.g. `test.only` forbidden), retries, and a single worker. |

## Stack

- [@playwright/test](https://playwright.dev/)
- [allure-playwright](https://allurereport.org/docs/playwright/) and [allure-commandline](https://www.npmjs.com/package/allure-commandline) for reporting

---

## Project in detail

### Goal and scope

This repository is a focused **UI automation suite** for GreenKart: a small e-commerce style practice app (product list, search, cart, checkout, promo). The tests run **against the real public URL** unless you point `GREENKART_ORIGIN` elsewhere. They are **not** unit tests of your own product code; they validate that critical user journeys still work in the browser.

### How the layers fit together

The code is split so each layer has one job:

1. **`playwright.config.ts`** — Tells the **runner** where tests live (`testDir: e2e`), how long to wait (`timeout`, `expect.timeout`, navigation/action timeouts), which **browser project** to use (Chromium desktop), and how to **report** (only Allure, writing into `allure-results`). It also sets **`use.baseURL`** from the same URL module as navigation, so global defaults stay aligned with `gotoHome()`.

2. **`src/config/urls.ts`** — Single place for the **application URL**. `urls.home` is used by `BasePage.gotoHome()` and imported into the Playwright config for `baseURL`. That avoids duplicating the string and makes environment switches (staging mirror, etc.) a one-line change via `GREENKART_ORIGIN`.

3. **`src/pages/` (Page Object Model)** — Each class represents a **slice of the UI** the tests interact with:

   - **`BasePage`** — Shared navigation (`gotoHome()`).
   - **`ProductsPage`** — Search, product cards, quantity steppers, add to cart, cart icon, cart preview visibility, cart badge count.
   - **`CartPreviewPage`** — The flyout cart and **Proceed to checkout**.
   - **`CheckoutPage`** — Checkout line items, promo code entry, promo message, place order control.

   Locators and low-level clicks/fills live here. If the DOM changes, you update **page objects** first; specs should rarely need selector edits.

4. **`src/fixtures/pages.ts`** — Uses Playwright’s **`test.extend`** to register three **fixtures**: `productsPage`, `cartPreviewPage`, `checkoutPage`. Each test receives fresh instances wired to that test’s `Page`. Specs import `test` and `expect` from this file instead of `@playwright/test`, so they get dependency injection **without** repeating `new ProductsPage(page)` in every file.

5. **`e2e/*.spec.ts`** — **Scenarios and assertions** only. They group related tests with `test.describe`, use `beforeEach` for common setup (typically `gotoHome()`), and read like short user stories: add items, open cart, proceed, assert checkout or promo behavior.

### What the current tests cover

- **`greenkart-products.spec.ts`** — Home catalogue visibility, **search** narrowing the list, **add to cart** with quantity and a **non-zero cart badge** (async polling so the UI can update).
- **`greenkart-checkout.spec.ts`** — Add product, open cart preview, **proceed to checkout**, assert a line item is visible; separate test for **invalid promo** and visible feedback on the promo message.

Together they exercise a **realistic path**: browse → search or pick product → cart → checkout surface → promo validation.

### Reporting pipeline (Allure)

On `npm test`, the configured reporter writes **machine-readable result files** under `allure-results/`. That folder is the **input** to the Allure CLI. `npm run allure:generate` turns those files into a static **HTML site** under `allure-report/`. `npm run allure:open` serves that folder in the browser. `allure:report` and `report` chain generate + open. Neither output folder should be committed for a typical repo; both are listed in `.gitignore`.

### Design choices (useful for reviews or interviews)

- **Page objects** improve **maintainability** when selectors or flows change.
- **Fixtures** reduce **boilerplate** and keep constructors and `page` wiring consistent.
- **One URL module** avoids drift between config `baseURL` and actual navigation.
- **Chromium-only** keeps install and CI faster; you can add Firefox/WebKit projects in config when needed.
- **Allure-only reporter** in config keeps a single reporting story; Playwright’s built-in HTML report is not produced by default in this setup.

### How you would extend it

- New screens or modals: add a **`src/pages/...`** class, expose it from **`src/fixtures/pages.ts`**, then use it in **`e2e`** specs.
- New environments: set **`GREENKART_ORIGIN`** (or extend `urls.ts` with named exports) and optionally add Playwright **projects** per environment.
- Richer Allure output: use **`allure-js-commons`** (labels, steps, attachments) inside tests or page methods as described in the [Allure Playwright docs](https://allurereport.org/docs/playwright/).

---

## Interview-ready answers

Use these as spoken answers; shorten on the fly if the interviewer wants less detail.

### “Walk me through this project.”

“I automated the GreenKart practice e-commerce site with **Playwright** and **TypeScript**. Tests live in **`e2e`**, and I structured the code with **page objects** under **`src/pages`** so selectors and actions stay reusable. I extended Playwright’s **`test` fixture** in **`src/fixtures/pages.ts`** to inject **`productsPage`**, **`cartPreviewPage`**, and **`checkoutPage`** into tests, so specs stay readable and I’m not repeating `new PageObject(page)` everywhere. The **base URL** is centralized in **`src/config/urls.ts`** and wired into **`playwright.config.ts`** for **`baseURL`**. Reporting is **Allure**: the run writes **`allure-results`**, then I generate and open the HTML report with npm scripts. I cover product search, add to cart, checkout line items, and invalid promo behavior.”

### “Why Page Object Model?”

“The UI is the thing that changes most often. If locators or click sequences live in every test, a small DOM change breaks many files. **Page objects** encapsulate ‘how we talk to this screen’ in one class per area—products, cart preview, checkout—so tests describe **what** we’re validating and page objects own **how** we drive the app. That scales better as the suite grows.”

### “Why custom fixtures instead of instantiating page objects in each test?”

“**`test.extend`** gives me **dependency injection**: Playwright creates a fresh **`page`** per test, and my fixtures build the page objects on top of that same **`page`**. Specs just list **`productsPage`** in the callback arguments. It cuts boilerplate, keeps wiring consistent, and matches how Playwright wants you to share setup across tests.”

### “Where does configuration live versus test logic?”

“**`playwright.config.ts`** is pure **runner configuration**: **`testDir`**, timeouts, **Chromium** project, **Allure** reporter, **`use`** defaults like **`baseURL`**, traces, screenshots on failure. It does not contain business steps. **Test logic** is only in **`e2e`**. **How we interact with the app** is in **`src/pages`**. **URLs** are in **`src/config`**. That separation makes it obvious where to change things for CI, reporting, or UI refactors.”

### “How do you handle environments or the base URL?”

“I keep the default GreenKart URL in **`urls.ts`** and use it for **`gotoHome()`** and for **`baseURL`** in config so they never drift. For another host, **`GREENKART_ORIGIN`** overrides the origin while the path stays the same. In a real team I’d add named environments or Playwright **projects** if we needed parallel targets.”

### “What scenarios did you automate?”

“**Product area**: catalogue visible on load, **search** filters products, **add to cart** with quantity and verification that the **cart count** updates—I used **`expect.poll`** where the badge updates asynchronously. **Checkout area**: open the cart preview, **proceed to checkout**, assert **line items**; and a case for **invalid promo** where I assert the promo feedback element is visible and not empty. Together that’s a credible slice of an e-commerce flow.”

### “How does reporting work?”

“Playwright is configured with **`allure-playwright`** only. Each run produces raw results under **`allure-results`**. After the run I run **`allure generate`** into **`allure-report`** and **`allure open`** to view it—wrapped as **`npm run allure:report`** and **`npm run report`**. In CI I’d upload **`allure-results`** or the generated HTML as a **pipeline artifact**.”

### “How would you reduce flakiness?”

“I rely on Playwright’s **auto-waiting** for locators and actions, reasonable **timeouts** in config, and **polling assertions** where the UI updates after an action—like the cart badge. If something were still flaky I’d add **explicit waits** on stable conditions, avoid **`waitForTimeout`**, use **retries on CI**, and consider **test isolation** so tests don’t share mutable cart state unless we reset or use a fresh context.”

### “How would you grow this suite?”

“I’d add **page objects** and **fixtures** for new flows—filters, multi-item checkout, valid promo if we had a stable code—keep specs **short and scenario-based**, and tag tests for **smoke vs regression** if the suite gets large. I’d also enrich Allure with **epics, features, or links** to tickets using **`allure-js-commons`** so reports stay useful for stakeholders.”

### One-line closing

“It’s a small project, but the **layering**—config, URLs, page objects, fixtures, specs—and **Allure** reporting mirror how I’d structure automation on a production team.”
