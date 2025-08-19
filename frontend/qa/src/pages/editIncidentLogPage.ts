import { expect, Page } from '@playwright/test';
import * as path from 'path';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';

import { UsernamesData } from '../helper/interface/usernameData';
import data from '../helper/data/username.json';
import dropdownMapping from '../helper/data/dropdownMapping.json';
import { basePage } from '../hooks/basePage';
import { LogEntrySelectType } from '../helper/util/enums';

const Elements = {
  btnAddLogEntry: "//button[contains(text(),'Add log entry')]",
  isLogTabActive: "//a[@role='tab' and @aria-selected='true' and contains(.,'$LINKNAME$')]",
  linkLogEntryTab: "//h2[@class='rollup-header']//a[starts-with(text(),'$LINKNAME$')]",
  ddCategoryById: "//div[@id='$DROPDOWNBYID$']//div[@data-value]",
  ddSelectCategory:
    "//div[starts-with(@id,'react-select-')]//span[contains(text(),'$DropdownOption$') and @class='option-label__label']",
  btnDateTimeNow: "//a[@class='date-now']",
  inpDescriptionTxt: "//div[@class='editor-input']",
  getLogEntryList: '//div[@class="log-entry-list"]//div[@class="item__header"]',

  btnFormExactLocation: '//div[@id="ExactLocation"]//button[.="$BUTTONSTATE$"]',
  txtFormTabByID: '//textarea[@id="$TEXTAREABYID$"]',
  inpFormLocationDescription: '//input[@id="location.description"]',

  inpFileUpload: '//input[@id="fileUpload"]',

  logTypeNearbyLabel: 'Category',
  selectComponentPlaceholderText: 'Select',
  incidentAddNowName: '< Now',

  setLocationButtonName: 'SET'
};

export default class EditIncidentLogPage {
  private readonly base: PlaywrightWrapper;

  private readonly users: UsernamesData = data;

  private readonly getLogEntriesCount: number = 0; // Declare the variable

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

  async setLogStatusByCount() {
    return this.page.locator(Elements.getLogEntryList).count();
  }

  async verifyLogStatusByCount(initalCount: number) {
    await basePage.customSleep(10000);
    await this.page.reload();
    await basePage.customSleep(5000);
    expect(await this.page.locator(Elements.getLogEntryList).count()).toEqual(initalCount + 1);
  }

  async btnClickAddLogEntry() {
    await this.page.locator(Elements.btnAddLogEntry).click();
  }

  async updateLogByTab(tabName: string) {
    const id = `log-tab-#${tabName.toLowerCase()}`;
    const tab = this.page.locator(`[id="${id}"]`);
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  async updateDropDownById(option: string, selectType : LogEntrySelectType = LogEntrySelectType.logType) {
    switch(+selectType) {
      case LogEntrySelectType.logType:
      case LogEntrySelectType.locationType:
        await this.page.getByPlaceholder(Elements.selectComponentPlaceholderText).nth(0).click();
        break;
      case LogEntrySelectType.majorIncidentDeclared:
        await this.page.getByPlaceholder(Elements.selectComponentPlaceholderText).nth(1).click();
        break;
      default:
        throw new Error("No LogEntrySelectType passed");
    };
    
    await this.page.waitForSelector(`role=option[name="${option}"]`);
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  async updateLogTabFormDateTimeNow() {
    await this.page.getByRole('button', {name: Elements.incidentAddNowName }).click();
  }

  async updateLogTabFormDesc(boolTagUser: boolean, boolAddDesc: boolean) {
    if (boolTagUser) {
      const randomUsername = this.getRandomUsername();

      await this.page.locator(Elements.inpDescriptionTxt).type(`@${randomUsername.slice(0, 4)}`);
      await basePage.customSleep(500);
      await this.page
        .getByRole('listbox', { name: 'Typeahead menu' })
        .getByText(randomUsername)
        .click();
    }

    if (boolAddDesc) {
      await this.page.locator(Elements.inpDescriptionTxt).type('Some Random Text');
    }
  }

  async btnAddLogSave() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async updateSitRepTextFields(isOptionalFieldNeeded: boolean) {
    await this.page
      .locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Hazards'))
      .type('Some Hazard Related Text');
    await this.page
      .locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Access'))
      .type('Some Access Related Text');
    await this.page
      .locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Casualties'))
      .type('Some Casualties Related Text');
    await this.page
      .locator(Elements.txtFormTabByID.replace('$TEXTAREABYID$', 'Emergency'))
      .type('Some Emergency Related Text');

    if (isOptionalFieldNeeded) {
      console.log('Need to implement Optional fields if required');
    }
  }

  async setSitRepLocation(isSitRepLocationReq: string) {
    if (await this.page.getByRole('button', {name: Elements.setLocationButtonName }).count() > 0) {
      await this.page.getByRole('button', {name: Elements.setLocationButtonName }).click();

      await this.page.waitForTimeout(2000);

      await this.updateDropDownById(isSitRepLocationReq, LogEntrySelectType.locationType);

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
          console.warn(`Invalid option: ${isSitRepLocationReq}`);
      }
    } else {
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
    await basePage.customSleep(30000);
    await basePage.page.reload();

    const lastLogEntry = this.page.locator('.log-entry-list .item').last();
    // Check if the last log entry is visible
    await expect(lastLogEntry).toBeVisible({ timeout: 30000 });

    // Get the text content of the log entry meta
    const logMetaText = await lastLogEntry.locator('.item__header p').first().textContent();

    // Assert that the meta text contains "Stage change"
    expect(logMetaText).toContain('Stage change');

    const stageChip = lastLogEntry.locator('.MuiChip-label');
    const stageText = await stageChip.textContent();

    expect(stageText).toContain(newStage);
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
