import { defineConfig } from '@playwright/test';
import { Browser, Page } from '@playwright/test';
 
 
export default defineConfig({
  testDir: './tests/specs',  // Your test directory
  timeout: 60000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],  
    ['json', { outputFile: 'playwright-report/test-results.json', open: 'never' }]]
    });

    
export const pageFixture = {
  browser: undefined as unknown as Browser,
  page: undefined as unknown as Page,
};
 
 