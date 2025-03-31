import { LoginPage } from '../pageobjects/loginPage';
import { pageFixture } from '../../playwright.config';
import { test, Browser, BrowserContext, chromium } from '@playwright/test';
import * as data from "../../TestData/testdata.json"

export const results: { testName: string, status: string }[] = [];

let browser: Browser;
let context: BrowserContext;
let loginPage: LoginPage;
loginPage = new LoginPage(pageFixture.page);


test.describe('Login Tests', () => {
  
  // Initialize browser before all tests--------------------------------------------------------------------------------------------------------
  test.beforeAll(async () => {
    console.log('Launching browser before all tests...');
    browser = await chromium.launch({ headless: true });
  });
  

  // Cleanup after all tests--------------------------------------------------------------------------------------------------------
  test.afterAll(async () => {
    console.log('Closing browser after all tests...');
    await browser.close();
    
  });
   
  

  // Create a new browser context and page before each test--------------------------------------------------------------------------------------------------------
  test.beforeEach(async () => {
    console.log('Setting up a new context and page for each test...');
    context = await browser.newContext();
    const page = await context.newPage();
    pageFixture.page = page;
  });
  
  
  // Close page and context after each test--------------------------------------------------------------------------------------------------------
  test.afterEach(async ({ page }, testInfo) => {
    console.log('Cleaning up after each test...');
  
    const testName = testInfo.title;
    const status = testInfo.status === 'passed' ? 'Pass' : 'Fail';
    results.push({ testName, status });
    

    // Take screenshot if the test failed
    if (testInfo.status === 'failed') {
      await pageFixture.page.screenshot({
        path: `../../playwright-report/data/${testInfo.title}.png`,
        type: 'png',
      });
    }

    testInfo.attachments.push({
      name: 'screenshot',
      path: `../../playwright-report/data/${testInfo.title}.png`,
      contentType: 'image/png',
    });
  
    await pageFixture.page.close();
    await context.close();
  });

  // ---------Actual test case------------------------------------------------------------------------------------------------
  test('Go to URL', async () => {
    await loginPage.gotoUrl(pageFixture); 
  });

  test('user login', async () => {
    await loginPage.gotoUrl(pageFixture); 
    await loginPage.loginAsRegisteredUser(pageFixture, data.testCredential.username, data.testCredential.password);
    await loginPage.verifyHomePage(pageFixture);  
  });




});
