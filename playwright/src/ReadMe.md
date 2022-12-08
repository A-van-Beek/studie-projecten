Om een applicatie in verschillende browsers (chrome, firefox, safari) te testen, kan je ook gebruik maken van Playwright (https://www.npmjs.com/package/playwright).
stappenplan: instructie/stappenplan: https://joyofcode.xyz/test-your-site-in-every-browser



Here is how to set up Playwright.

1. Initialize a new project inside an empty repository.
            terminal:    npm init -y

2. Install @playwright/test as a development dependency.
            terminal:   npm i -D @playwright/test

3. Install the default browsers.
            terminal:    npx playwright install

4. Update package.json (ik heb alleen de scripts toegevoegd
           

{
  "scripts": {
    "test:chrome": "npx playwright test --headed --browser=chromium",
    "test:firefox": "npx playwright test --headed --browser=firefox",
    "test:safari": "npx playwright test --headed --browser=webkit"
  },
  "devDependencies": {
    "@playwright/test": "^1.22.1"
  }
}


5. Add a test for Playwright

This is only so you can specify what page to visit and pause the browser so you can inspect the page — if you comment out the page.goto line it’s going to open a blank tab.
ik heb een nieuwe file gemaakt: tests/browser.test.ts

import { test } from '@playwright/test'

test('test browser', async ({ page }) => {
  // point this to wherever you want
  await page.goto('http://localhost:3000/')

  // keep browser open
  await page.pause()
})

 

6. Run the test using one of the scripts.
terminal:   npm run test:safari

That’s it! 🎉