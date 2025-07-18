import { expect, Page } from '@playwright/test';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';

export default class LandingPage {
  private readonly base: PlaywrightWrapper;

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  // Object Locators
  private readonly Elements = {
    menuLisa: "//a[contains(@href,'$MENUNAME$')]",
    navMenu: "//div[@class='top-header']//li/a[.='$MENUNAME$']"
  };

  async verifyDemoLandingPage() {
    await expect(this.page).toHaveTitle('NDT applications');
  }

  async clickMenuByName() {
    await this.page.locator(this.Elements.menuLisa.replace('$MENUNAME$', process.env.LISAURL)).click();
    await this.page.waitForTimeout(3000);
  }

  async verifyLisaPageTitle() {
    await this.page.waitForTimeout(5000);

    await expect(this.page).toHaveTitle('LISA');
  }

  async launchNDTPapp() {
    await this.page.waitForTimeout(5000);

    await this.page.goto(process.env.LISAURL);
  }

  async verifyLisaAppPage() {
    await this.page.waitForTimeout(5000);

    await this.page.goto(process.env.LISAURL);

    await expect(this.page).toHaveTitle('LISA');

    await this.page.waitForTimeout(2000);
  }

  async selectEditMenuByName(menuName: string) {
    await this.page.click(this.Elements.navMenu.replace('$MENUNAME$', menuName));
  }
}
