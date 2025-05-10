import {expect, test} from '@playwright/test';

const USER_EMAIL = 'test@example.com';
const USER_PASSWORD = 'Test123!';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should allow a user to register', async ({page}) => {
    await page.getByRole('link', {name: 'Регистрация'}).click();
    await page.getByRole('button', {name: 'Създайте акаунт'}).click();

    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.locator('input[name="username"], input[name="name"]').fill('Test User 2');
    await page.locator('input[type="email"]').fill(uniqueEmail);
    await page.locator('input[type="password"]').first().fill(USER_PASSWORD);
    await page.locator('input[type="password"]').nth(1).fill(USER_PASSWORD);

    await page.getByRole('button', {name: 'Създай'}).click();

    await expect(page).toHaveURL(/\/$/, {timeout: 10000});
  });

  test('should allow a user to login', async ({page}) => {
    await page.getByRole('link', {name: /Регистрация|Профил/i}).click();

    await page.locator('input[type="email"]').fill(USER_EMAIL);
    await page.locator('input[type="password"]').fill(USER_PASSWORD);

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/$/, {timeout: 10000});
  });

  test('should handle Google authentication option', async ({page}) => {
    await page.getByRole('link', {name: /регистрация|профил/i}).click();

    const googleButton = page.locator('text=Вход с Google account');
    await expect(googleButton).toBeVisible();
  });

  test('should handle form validation errors', async ({page}) => {
    await page.getByRole('link', {name: /Регистрация|Профил/i}).click();
    await page.getByRole('button', {name: 'Създайте акаунт'}).click();
    await page.getByRole('button', {name: 'Създай'}).click();

    const errors = page.locator('text=/required|cannot be empty|missing/i');
    await expect(errors.first()).toBeVisible({timeout: 5000});
  });
});
