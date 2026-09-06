import { test, expect } from '@playwright/test';

test('admin approves a pending enrollment', async ({ page }) => {
  await page.goto('/dashboard'); // or /command-center

  await expect(
    page.getByRole('heading', { name: /command center/i })
  ).toBeVisible();

  const firstApprove = page.getByRole('button', { name: 'Approve' }).first();
  await firstApprove.click();

  await expect(page.getByText('Approved').first()).toBeVisible();
});