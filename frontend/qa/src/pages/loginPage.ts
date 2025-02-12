import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class LoginPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    //Object Locators
    private Elements = {
        userInput: "username",
        nextBtn: "",
        passwordInput: "Password",
        loginBtn: "button[color='primary']",
        errorMessage: "alert"
    }

    async navigateToLoginPage(url: string) {
        await this.base.goto(url);
        await expect(this.page).toHaveTitle("Sign-in");
    }
    async enterUserName(user: string) {
        await this.page.locator('[name="username"]').fill(user);
        await this.page.getByRole('button', { name: 'Next' }).click();

    }
    async enterPassword(password: string) {
        await expect(this.page).toHaveTitle("Enter your password");
        await this.page.locator('[name="password"]').fill(password);
    }

    async clickLoginButton() {
        //await this.base.waitAndClick(this.Elements.loginBtn);
        await this.page.getByRole('button', { name: 'Continue' }).click();

    }

    getErrorMessage() {
        return this.page.getByRole("alert");
    }

    async loginUser(user: string, password: string) {
        await this.enterUserName(user);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }


}