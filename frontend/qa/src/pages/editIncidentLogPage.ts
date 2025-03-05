import { expect, Page } from '@playwright/test';
import * as path from 'path';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';

import { UsernamesData } from '../helper/interface/usernameData';
import data from '../helper/data/username.json';
import dropdownMapping from '../helper/data/dropdownMapping.json';
import { basePage } from '../hooks/basePage';

const Elements = {
  txtPageName: "//div[contains(@class,'page-title')]//h1",
  btnAddLogEntry: "//button[contains(text(),'Add log entry')]",
  isLogTabActive: "//a[contains(@class,'active') and contains(text(),'$LINKNAME$')]",
  linkLogEntryTab: "//h2[@class='rollup-header']//a[starts-with(text(),'$LINKNAME$')]",
  ddCategoryById: "//div[@id='$DROPDOWNBYID$']//div[@data-value]",
  ddSelectCategory: "//div[starts-with(@id,'react-select-')]//span[contains(text(),'$DropdownOption$') and @class='option-label__label']",
  btnDateTimeNow: "//a[@class='date-now']",
  inpDescriptionTxt: "//div[@class='editor-input']",
  btnSaveLog: "//button[@class='button submit']",
  getLogEntryList: '//div[@class="log-entry-list"]//div[@class="item__header"]',

  btnFormExactLocation: '//div[@id="ExactLocation"]//button[.="$BUTTONSTATE$"]',
  txtFormTabByID: '//textarea[@id="$TEXTAREABYID$"]',
  inpFormLocationDescription: '//input[@id="location.description"]',

  inpFileUpload: '//input[@id="fileUpload"]',

};

export default class EditIncidentLogPage {
  private readonly base: PlaywrightWrapper;

  private readonly users: UsernamesData = data;

  private getLogEntriesCount: number = 0; // Declare the variable

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  static getDropdownCategory(value: string): string | null {
    // eslint-disable-next-line
    for (const category in dropdownMapping) {
      if (Object.keys(dropdownMapping[category]).includes(value)) {
        return category;
      }
    }
    return null; // Return null if not found
  }

  async verifyPageTitle() {
    const getPageTitle = await this.page.locator(Elements.txtPageName).textContent();
    expect(getPageTitle).toContain('Incident log');
  }

  async setLogStatusByCount() {
    return this.page.locator(Elements.getLogEntryList).count();
  }

  async verifyLogStatusByCount(initalCount: number) {
    await basePage.customSleep(10000);
    await this.page.reload();
    await basePage.customSleep(5000);
    expect(await this.page.locator(Elements.getLogEntryList).count())
      .toEqual(initalCount + 1);
  }

  async btnClickAddLogEntry() {
    await this.page.locator(Elements.btnAddLogEntry).click();
  }

  async updateLogByTab(tabName: string) {
    if (!(await this.page.locator(Elements.isLogTabActive.replace('$LINKNAME$', tabName)).count() > 0)) {
      await this.page.locator(Elements.linkLogEntryTab.replace('$LINKNAME$', tabName)).click();
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Tab "${tabName}" is already active.`);
    }
  }

  async updateDropDownById(logType: string) {
    const logTypeId = await EditIncidentLogPage.getDropdownCategory(logType);

    await this.page.locator(Elements.ddCategoryById.replace('$DROPDOWNBYID$', logTypeId)).first().click();
    await this.page.locator(Elements.ddSelectCategory.replace('$DropdownOption$', logType.split(',')[0])).click();
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

  async updateSitRepTextFields(isOptionalFieldNeeded: boolean) {
    await this.page.locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Hazards')).type('Some Hazard Related Text');
    await this.page.locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Access')).type('Some Access Related Text');
    await this.page.locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Casualties')).type('Some Casualties Related Text');
    await this.page.locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Emergency')).type('Some Emergency Related Text');

    // eslint-disable-next-line no-console
    if (isOptionalFieldNeeded) { console.log('Need to implement Optional fields if required'); }
  }

  async setSitRepLocation(isSitRepLocationReq:string) {
    if (await this.page.locator(Elements.btnFormExactLocation.replace('$BUTTONSTATE$', 'Set')).count() > 0) {
      await this.page.locator(Elements.btnFormExactLocation.replace('$BUTTONSTATE$', 'Set')).click();

      await this.updateLogByTab('Location');
      await this.updateDropDownById(isSitRepLocationReq);

      switch (isSitRepLocationReq) {
      case 'Description only':
        await this.page.locator(Elements.inpFormLocationDescription).fill('London');
        await this.updateLogByTab('Form');
        break;

      case 'Point on a map':
        await this.page.getByRole('region', { name: 'Map' }).click({
          position: {
            x: 792,
            y: 283
          }
        });
        await this.updateLogByTab('Form');
        break;

      case 'Both a point on a map and a description':
        // eslint-disable-next-line no-console
        console.warn('TO-DO: Have a seperate work item');
        break;

      default:
        // eslint-disable-next-line no-console
        console.warn(`Invalid option: ${isSitRepLocationReq}`);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(this.page.locator(Elements.btnFormExactLocation.replace('$BUTTONSTATE$', 'Set')));
    }
  }

  async doFileUpload(isFileUpload: string) {
    if (isFileUpload === 'Yes') {
      await this.updateLogByTab('Files');
      const filePath = path.resolve(__dirname, '../assets/sample-file.txt');

      await this.page.locator(Elements.inpFileUpload).setInputFiles(filePath);
    }
  }

  async clickRandomPointOnMap() {
    // Locate the map region
    const mapElement = this.page.getByRole('region', { name: 'Map' });

    // Get the bounding box of the map
    const boundingBox = await mapElement.boundingBox();
    if (!boundingBox) {
      throw new Error('Map element not found or not visible.');
    }

    // Generate a random (x, y) coordinate within the map area
    const randomX = Math.floor(boundingBox.x + Math.random() * boundingBox.width);
    const randomY = Math.floor(boundingBox.y + Math.random() * boundingBox.height);

    // Click on the random location
    await mapElement.scrollIntoViewIfNeeded();
    await mapElement.click({ position: { x: randomX, y: randomY } });
  }

  private getRandomUsername(): string {
    const randomIndex = Math.floor(Math.random() * this.users.data.length);
    return this.users.data[randomIndex];
  }
}
