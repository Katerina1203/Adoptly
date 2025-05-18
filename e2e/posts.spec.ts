import {expect, test} from '@playwright/test';

const USER_EMAIL = 'test@example.com';
const USER_PASSWORD = 'Test123!';

test.describe('Animal Posts', () => {
  test.beforeEach(async ({context, page}) => {
    await context.clearCookies();
    await page.goto('/');

    await page.getByRole('link', {name: /регистрация|профил/i}).click();
    await page.locator('input[type="email"]').fill(USER_EMAIL);
    await page.locator('input[type="password"]').fill(USER_PASSWORD);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/$/, {timeout: 10000});

    await page.getByRole('link', {name: /регистрация|профил/i}).click();

    await page.waitForTimeout(2000)
  });

  test('should display list of animal posts', async ({page}) => {
    await page.goto('/animals');

    await expect(page.getByText('Dog')).toBeVisible();
    await expect(page.getByText('Cat')).toBeVisible();
  });
});
