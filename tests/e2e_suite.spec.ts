import { test, expect } from '@playwright/test';

test.describe('Mikir Flow AI - Full E2E Application Test Suite', () => {

  test('1. Test Home Canvas & Flow Diagram Page', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('PRD Dokumen PT Javas')).toBeVisible();
  });

  test('2. Test PRD Document Page', async ({ page }) => {
    await page.goto('http://localhost:3000/prd');
    await expect(page.getByText('PRD')).toBeVisible();
  });

  test('3. Test Developer Task Kanban Page', async ({ page }) => {
    await page.goto('http://localhost:3000/task');
    await expect(page.getByText('Board Task Developer')).toBeVisible();
    await expect(page.getByText('Started (To Do)')).toBeVisible();
    await expect(page.getByText('On Going')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
  });

  test('4. Test User Role Switching', async ({ page }) => {
    await page.goto('http://localhost:3000/users');
    await expect(page.locator('body')).toBeVisible();
  });

});
