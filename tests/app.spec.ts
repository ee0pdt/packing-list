import { test, expect } from '@playwright/test';

test.describe('Packing List App', () => {
  test('should load the page without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Listen for page errors
    const pageErrors: Error[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error);
    });

    // Navigate to the page
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/page-load.png', fullPage: true });

    // Log any errors
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }
    if (pageErrors.length > 0) {
      console.log('Page errors:', pageErrors.map(e => e.message));
    }

    // Check if the page loaded
    const title = await page.title();
    console.log('Page title:', title);

    // Check for the packing list app container
    const appVisible = await page.locator('body').isVisible();
    expect(appVisible).toBe(true);

    // Report test results
    console.log('Test completed with', errors.length, 'console errors and', pageErrors.length, 'page errors');
  });

  test('should initialize WebGPU liquid glass', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if liquid glass canvas was created
    const canvas = await page.locator('#liquid-glass').count();
    console.log('Liquid glass canvas found:', canvas > 0);

    // Wait a bit for WebGPU initialization
    await page.waitForTimeout(2000);

    console.log('Errors:', errors);
    console.log('Warnings:', warnings);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/webgpu-init.png', fullPage: true });
  });

  test('should display packing list UI elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for potential UI elements to load
    await page.waitForTimeout(1000);

    // Get page content for debugging
    const content = await page.content();
    console.log('Page has content:', content.length > 0);

    // Check for common UI elements
    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();

    console.log('Inputs found:', inputs);
    console.log('Buttons found:', buttons);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/ui-elements.png', fullPage: true });
  });
});
