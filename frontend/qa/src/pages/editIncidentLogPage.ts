import { expect, Page } from '@playwright/test';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';

import { UsernamesData } from '../helper/interface/usernameData';
import data from '../helper/data/username.json';
import { basePage } from '../hooks/basePage';

const Elements = {
  txtPageName: "//h1[@class='page-title']/div[@class='title']",
  btnAddLogEntry: "//button[contains(text(),'Add log entry')]",
  linkLogEntryTab: "//h2[@class='rollup-header']//a[text()='$LINKNAME$']",
  ddCategory: "//div[@id='type']//div[@data-value]",
  ddSelectCategory: "//div[starts-with(@id,'react-select-')]//span[.='$DropdownOption$' and @class='option-label__label']",
  btnDateTimeNow: "//a[@class='date-now']",
  inpDescriptionTxt: "//div[@class='editor-input']",
  btnSaveLog: "//button[@class='button submit']",
  getLogEntryList: '//div[@class="log-entry-list"]//div[@class="item__header"]'
};

export default class EditIncidentLogPage {
  private readonly base: PlaywrightWrapper;

  private readonly users: UsernamesData = data;

  private getLogEntriesCount: number = 0; // Declare the variable

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  async verifyPageTitle() {
    const getPageTitle = await this.page.locator(Elements.txtPageName).textContent();
    expect(getPageTitle).toContain('Incident log');
  }

  async setLogStatusByCount() {
    return this.page.locator(Elements.getLogEntryList).count();
  }

  async verifyLogStatusByCount(initalCount: number) {
    await basePage.customSleep(12500);
    await this.page.reload();
    await basePage.customSleep(2500);
    expect(await this.page.locator(Elements.getLogEntryList).count())
      .toEqual(initalCount + 1);
  }

  async btnClickAddLogEntry() {
    await this.page.locator(Elements.btnAddLogEntry).click();
  }

  async updateLogByTab(tabName: string) {
    // await this.page.getByRole('link', { name: 'Form *' }).click();
    await this.page.locator(Elements.linkLogEntryTab.replace('$LINKNAME$', tabName)).click();
  }

  async updateLogTabFormType(logType: string) {
    await this.page.locator('.react-select__input-container').first().click();
    await this.page.locator(Elements.ddSelectCategory.replace('$DropdownOption$', logType)).click();
  }

  async updateLogTabFormDateTimeNow(inpString: string) {
    if (inpString === 'Now') await this.page.getByRole('link', { name: '< Now' }).click();
  }

  async updateLogTabFormDesc(boolTagUser: boolean, boolAddDesc: boolean) {
    if (boolTagUser) {
      const randomUsername = this.getRandomUsername();

      await this.page.locator(Elements.inpDescriptionTxt).type(`@${randomUsername.slice(0, 4)}`);
      await basePage.customSleep(500);
      await this.page.getByRole('listbox', { name: 'Typeahead menu' }).getByText(randomUsername).click();
    }

    if (boolAddDesc) {
      await this.page.locator(Elements.inpDescriptionTxt).type('Some Random Text');
    }
  }

  async btnAddLogSave() {
    await this.page.locator(Elements.btnSaveLog).click();
  }

  private getRandomUsername(): string {
    const randomIndex = Math.floor(Math.random() * this.users.data.length);
    return this.users.data[randomIndex];
  }
}
