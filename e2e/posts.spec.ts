import {expect, test} from '@playwright/test';
import path from 'path';

const USER_EMAIL = 'test@example.com';
const USER_PASSWORD = 'Test123!';

test.describe('Animal Posts', () => {
  test.beforeEach(async ({context, page}) => {
    await context.clearCookies();
    await page.goto('/');

    // Login
    await page.getByRole('link', {name: /регистрация|профил/i}).click();
    await page.locator('input[type="email"]').fill(USER_EMAIL);
    await page.locator('input[type="password"]').fill(USER_PASSWORD);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/$/, {timeout: 10000});
  });

  test('should display list of animal posts', async ({page}) => {
    await page.goto('/animals');

    // Verify posts are visible
    await expect(page.locator('a[href^="/animals/"]').first()).toBeVisible();
    await expect(page.getByText(/Dog/i)).toBeVisible();
  });

  test('should create a new animal post', async ({page}) => {
    await page.goto('/user');

    // Open add animal form
    await page.getByTestId('create-post-btn').click();

    // Fill form with valid data
    await page.getByLabel(/Вид/i).fill('Котка');
    await page.getByLabel(/Възраст/i).fill('3');
    await page.getByLabel(/Местоположение/i).fill('София');
    await page.getByRole('combobox', {name: /Пол/i}).selectOption('мъжки');
    await page.getByLabel(/Описание/i).fill('Много послушна котка');

    // Upload image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel(/Снимки/i).click();
    const fileChooser = await fileChooserPromise;
    const imagePath = path.join(__dirname, './fixtures/test-image.jpg');
    await fileChooser.setFiles(imagePath);

    // Submit form
    await page.getByRole('button', {name: /Добави/i}).click();

    // Verify post was created
    await expect(page.getByText('Котка')).toBeVisible();
    await expect(page.getByText('София')).toBeVisible();
  });

  test('should validate required fields when creating a post', async ({page}) => {
    await page.goto('/user');

    await page.getByTestId('create-post-btn').click();

    // Submit empty form
    await page.getByRole('button', {name: /Добави/i}).click();

    // Verify validation errors
    await expect(page.getByText(/Въведете вид/i)).toBeVisible();
    await expect(page.getByText(/Въведете местоположение/i)).toBeVisible();
    await expect(page.getByText(/Моля въведете описание/i)).toBeVisible();
  });
});
