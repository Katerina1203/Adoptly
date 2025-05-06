import {defineConfig} from '@playwright/test';

export default defineConfig({
  testMatch: ['**/*.spec.{ts,tsx}'],
  testIgnore: ['**/*.test.{ts,tsx}'],
});
