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
  isLogTabActive: "//a[@aria-selected='true' and contains(@id,'$LINKNAME$')]",
  linkLogEntryTab: "//h2[@class='rollup-header']//a[starts-with(text(),'$LINKNAME$')]",
  ddCategoryById: "//label[@for='$DROPDOWNBYID$']/..//input",
  ddSelectCategory: "//li[contains(text(),'$DropdownOption$')]",
  btnDateTimeNow: "//a[@class='date-now']",
  inpDescriptionTxt: "//div[@class='editor-input']",
  btnSaveLog: "//button[.='Save']",
  getLogEntryList: '//div[@class="log-entry-list"]//div[@class="item__header"]',
  DateTimeAsNow: "//button[.='< Now']",
  
  btnFormExactLocation: '//div[@id="ExactLocation"]//button[.="$BUTTONSTATE$"]',
  txtFormTabByID: '//textarea[@id="$TEXTAREABYID$"]',
  inpFormLocationDescription: '//input[@id="location.description"]',

  inpFileUpload: '//input[@id="fileUpload"]',
  taggedUserPopup: '//div[@id="typeahead-menu"]//span',

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
    if (inpString === 'Now') await this.page.locator(Elements.DateTimeAsNow).click();
  }

  async updateLogTabFormDesc(boolTagUser: boolean, boolAddDesc: boolean) {
    if (boolTagUser) {
      const randomUsername = this.getRandomUsername();

      await this.page.locator(Elements.inpDescriptionTxt).type(`@${randomUsername.slice(0, 4)}`);
      await basePage.customSleep(500);
      await this.page.locator(Elements.taggedUserPopup).getByText(randomUsername).click();
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
        break;
      case 'Point on a map':
        await this.page.getByRole('region', { name: 'Map' }).click({
          position: {
            x: 792,
            y: 283
          }
        });
        break;
      case 'Both a point on a map and a description':
        await this.page.locator(Elements.inpFormLocationDescription).fill('London');
        await this.page.getByRole('region', { name: 'Map' }).click({
          position: {
            x: 792,
            y: 283
          }
        });
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Invalid option: ${isSitRepLocationReq}`);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(this.page.locator(Elements.btnFormExactLocation.replace('$BUTTONSTATE$', 'Set')));
    }
    await this.updateLogByTab('Form');
  }

  async doFileUpload(isFileUpload: string) {
    if (isFileUpload === 'Yes') {
      await this.updateLogByTab('Files');
      const filePath = path.resolve(__dirname, '../assets/sample-file.txt');

      await this.page.locator(Elements.inpFileUpload).setInputFiles(filePath);
    }
  }

  async verifyUpdatedStage(newStage: string) {
    await this.page.reload();
    await basePage.customSleep(1000);

    const lastLogEntry = this.page.locator('.log-entry-list .item').last();
    // Check if the last log entry is visible
    await expect(lastLogEntry).toBeVisible();

    // Get the text content of the log entry meta
    const logMetaText = await lastLogEntry.locator('.log-entry-meta div').first().textContent();

    // Assert that the meta text contains "Stage change"
    expect(logMetaText).toContain('Stage change');

    const logEntryDetails = await lastLogEntry.locator('.log-entry-details').first().textContent();
    expect(logEntryDetails).toContain(newStage);
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
