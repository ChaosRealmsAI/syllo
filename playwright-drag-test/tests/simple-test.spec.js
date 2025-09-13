import { test, expect } from '@playwright/test';

test('简单验证测试', async ({ page }) => {
  await page.setContent('<h1>Hello World</h1>');
  await expect(page.locator('h1')).toHaveText('Hello World');
  console.log('✅ 基本测试通过');
});