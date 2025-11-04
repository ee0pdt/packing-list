import { test, expect } from '@playwright/test';

test.describe('Jelly Progress Bar', () => {
  test('should show 0% progress when no items are checked', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the app to render
    await page.waitForSelector('text=Packing List', { timeout: 10000 });

    // Check the progress counter text
    const progressText = await page.locator('text=/ 3').textContent();
    console.log('Initial progress text:', progressText);

    // Should show 0 / 3
    expect(progressText).toContain('0 / 3');
  });

  test('should update progress when items are checked', async ({ page }) => {
    const errors: string[] = [];
    const logs: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      logs.push(`[${msg.type()}] ${text}`);
      if (msg.type() === 'error') {
        errors.push(text);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the app to render
    await page.waitForSelector('text=Packing List', { timeout: 10000 });

    // Initial state: 0 / 3
    let progressText = await page.locator('span:has-text("/ 3")').textContent();
    console.log('Initial:', progressText);
    expect(progressText).toContain('0 / 3');

    // Check the first item
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    await page.waitForTimeout(500); // Wait for animation

    // Should now show 1 / 3
    progressText = await page.locator('span:has-text("/ 3")').textContent();
    console.log('After checking 1 item:', progressText);
    expect(progressText).toContain('1 / 3');

    // Check the second item
    const secondCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await secondCheckbox.check();
    await page.waitForTimeout(500);

    // Should now show 2 / 3
    progressText = await page.locator('span:has-text("/ 3")').textContent();
    console.log('After checking 2 items:', progressText);
    expect(progressText).toContain('2 / 3');

    // Check the third item
    const thirdCheckbox = page.locator('input[type="checkbox"]').nth(2);
    await thirdCheckbox.check();
    await page.waitForTimeout(500);

    // Should now show 3 / 3
    progressText = await page.locator('span:has-text("/ 3")').textContent();
    console.log('After checking all items:', progressText);
    expect(progressText).toContain('3 / 3');

    // Uncheck one
    await firstCheckbox.uncheck();
    await page.waitForTimeout(500);

    // Should show 2 / 3
    progressText = await page.locator('span:has-text("/ 3")').textContent();
    console.log('After unchecking 1 item:', progressText);
    expect(progressText).toContain('2 / 3');

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/progress-bar-test.png', fullPage: true });

    // Log any errors
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }

    console.log('All console logs:');
    logs.forEach(log => console.log(log));
  });

  test('should render WebGPU canvas for progress bar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the app to render
    await page.waitForSelector('text=Packing List', { timeout: 10000 });

    // Look for canvas element inside progress container
    const canvas = await page.locator('.glass-button canvas').count();
    console.log('Canvas elements found:', canvas);

    // Should have at least one canvas (progress bar)
    // Note: might have 2 - one for progress bar, one for liquid glass overlay
    expect(canvas).toBeGreaterThanOrEqual(1);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/progress-canvas.png', fullPage: true });
  });

  test('should handle rapid checking and unchecking', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('text=Packing List', { timeout: 10000 });

    const checkboxes = page.locator('input[type="checkbox"]');

    // Rapidly check all
    for (let i = 0; i < 3; i++) {
      await checkboxes.nth(i).check();
      await page.waitForTimeout(100);
    }

    let progressText = await page.locator('span:has-text("/ 3")').textContent();
    console.log('After rapid checking:', progressText);
    expect(progressText).toContain('3 / 3');

    // Rapidly uncheck all
    for (let i = 0; i < 3; i++) {
      await checkboxes.nth(i).uncheck();
      await page.waitForTimeout(100);
    }

    progressText = await page.locator('span:has-text("/ 3")').textContent();
    console.log('After rapid unchecking:', progressText);
    expect(progressText).toContain('0 / 3');

    await page.screenshot({ path: 'tests/screenshots/rapid-toggle.png', fullPage: true });
  });

  test('should show correct progress with localStorage items', async ({ page }) => {
    // Set up localStorage with items
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('packapp-items', JSON.stringify([
        { id: '1', name: 'Test Item 1', checked: true },
        { id: '2', name: 'Test Item 2', checked: false },
        { id: '3', name: 'Test Item 3', checked: true },
        { id: '4', name: 'Test Item 4', checked: false },
      ]));
    });

    // Reload to pick up localStorage
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=Packing List', { timeout: 10000 });

    // Should show 2 / 4 (2 items checked out of 4)
    const progressText = await page.locator('span:has-text("/ 4")').textContent();
    console.log('Progress with localStorage items:', progressText);
    expect(progressText).toContain('2 / 4');

    await page.screenshot({ path: 'tests/screenshots/localstorage-progress.png', fullPage: true });
  });
});
