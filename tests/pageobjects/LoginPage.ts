import { expect, Page } from '@playwright/test';
import * as data from "../../TestData/testdata.json"
import { pageFixture } from "../../playwright.config";
let TIMEOUT = 50*1000

export class LoginPage {
     constructor(private page:Page) {}
       
        private readonly emailAddress = '//input[@id="user-name"]'
        private readonly password = '//input[@aid="password"]'
        private readonly loginButton = '//input[@id="login-button"]'
        private readonly homePageTitle = '//div[contains(text(),"Swag Labs")]'

    async gotoUrl(pageFixture){     
        await pageFixture.page.goto(data.url);
    }

    async loginAsRegisteredUser(pageFixture, username, password) {
        await expect(pageFixture.page.locator(this.emailAddress)).toBeVisible({timeout : TIMEOUT});
        await pageFixture.page.locator(this.emailAddress).fill(username);

        await expect(pageFixture.page.locator(this.password)).toBeVisible();
        await pageFixture.page.locator(this.password).fill(password);

        await pageFixture.page.locator(this.loginButton).click();
   
    }

    async verifyHomePage(pageFixture) {
        await expect(pageFixture.page.locator(this.homePageTitle)).toBeVisible({timeout : TIMEOUT});
    }
}