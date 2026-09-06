import { test as setup, expect } from '@playwright/test';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');

  await page
    .getByLabel(/email|username/i)
    .fill(process.env['TMS_ADMIN_EMAIL'] ?? process.env['TMS_ADMIN_USER']!);

  await page.getByLabel('Password').fill(process.env['TMS_ADMIN_PASS']!);

  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(
    page.getByRole('heading', { name: /command center/i })
  ).toBeVisible();

  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});