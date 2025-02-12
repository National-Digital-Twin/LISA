import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class LandingPage {
    private readonly base: PlaywrightWrapper
    constructor(private readonly page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    //Object Locators
    private readonly Elements = {
        menuLisa: "//div[.='LISA']",
        menuIris: "",
        menuParalog: "",
    }

    async verifyDemoLandingPage() {
        await expect(this.page).toHaveTitle(".:Demo Landing Page:.");
    }

    async clickMenuByName(menuName:string) {
        //await this.base.waitAndClick(this.Elements.loginBtn);
        await this.page.locator(this.Elements.menuLisa).click();
        await this.page.waitForTimeout(3000);
    }


}
