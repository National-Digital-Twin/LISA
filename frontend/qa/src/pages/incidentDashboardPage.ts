import { expect, Page } from '@playwright/test';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';

export default class IncidentDashboardPage {
  private readonly base: PlaywrightWrapper;

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  private readonly Elements = {
    addIncidentBtn: 'Add new incident',
    includeClosedIncidents: 'Include closed incidents',
    incidents: '.incident-title',
    incidentH1: '.title',
    closedIncident: '.subtitle',
    selectIncidentByNameStatus:
      "//a[contains(@class, 'incident')][.//span[normalize-space(.) = '$INCIDENTNAME$'] and .//span[contains(@class, 'incident-stage') and contains(text(), '$INCIDENTSTATUS$')]]",

    editIncidentReferredBy: '//input[@id="referrer.name"]',
    editIncidentOrganisation: '//input[@id="referrer.organisation"]',
    editIncidentTelephoneNo: '//input[@id="referrer.telephone"]',
    editIncidentEmail: '//input[@id="referrer.email"]'
  };

  async verifyAddIncidentBtn() {
    const button = this.page.getByRole('button', { name: this.Elements.addIncidentBtn });
    await expect(button).toBeVisible();
  }

  async checkClosedIncidentCheckBox() {
    const checkbox = this.page.getByLabel(this.Elements.includeClosedIncidents);
    expect(await checkbox.isChecked()).toBeFalsy();
    await checkbox.check();
    expect(await checkbox.isChecked()).toBeTruthy();
  }

  async verifyAllIncidenceDetailsAndCount() {
    const incidents = this.page.locator(this.Elements.incidents);
    const incidentTexts = await incidents.allTextContents();
    const allIncidentText = await this.page.locator(this.Elements.incidentH1).textContent();
    const closedIncidentText = await this.page.locator(this.Elements.closedIncident).innerText();
    const activeIncidentNumber = Number(/\d+/.exec(allIncidentText)[0]);
    const closedIncidentNumber = Number(/\d+/.exec(closedIncidentText)[0]);
    await this.page.waitForSelector(this.Elements.incidents, { state: 'visible' });
    await this.page.waitForSelector(this.Elements.closedIncident, { state: 'visible' });
    const totalIncidents = activeIncidentNumber + closedIncidentNumber;
    const incidentCount = await incidents.count();
    // Validate total incidents
    expect(incidentCount).toEqual(totalIncidents);
    // Validate date and title format
    const datePattern = /\d{1,2} \w{3,} \d{4}/;
    const titlePattern = /: .+/;

    // eslint-disable-next-line no-restricted-syntax
    for (const text of incidentTexts) {
      expect(datePattern.test(text)).toBeTruthy();
      const titlePart = text.replace(datePattern, '').trim();
      // Ensure there is something after the date
      expect(titlePart.length).toBeGreaterThan(0);
      // Check if the title part has a colon and some description after it
      expect(titlePattern.test(titlePart)).toBeTruthy();
    }
  }

  async verifyActiveAndClosedTitleAreDisplayed() {
    const allIncidentText = await this.page.locator(this.Elements.incidentH1).textContent();
    const closedIncidentText = await this.page.locator(this.Elements.closedIncident).innerText();
    const activeIncidentNumber = /\d+/.exec(allIncidentText)[0];
    const closedIncidentNumber = /\d+/.exec(closedIncidentText)[0];
    const uiH1IncidentLocator = this.page.getByText(
      `${activeIncidentNumber} active incidents( +${closedIncidentNumber} closed )`
    );
    const uiH1IncidentText = await uiH1IncidentLocator.textContent();
    expect(allIncidentText).toBe(uiH1IncidentText);
  }

  async selectIncidentByNameStatus(incidentName: string, incidentStatus: string) {
    await this.page.getByRole('link', { name: incidentName + ' ' + incidentStatus }).click();
  }

  async editIncidentByField(fieldName, inputText: string) {
    switch (fieldName) {
      case 'ReferredBy':
        await this.page.locator(this.Elements.editIncidentReferredBy).clear();
        await this.page.locator(this.Elements.editIncidentReferredBy).fill(inputText);
        break;
      case 'Organisation':
        await this.page.locator(this.Elements.editIncidentOrganisation).clear();
        await this.page.locator(this.Elements.editIncidentOrganisation).fill(inputText);
        break;
      case 'TelephoneNo':
        await this.page.locator(this.Elements.editIncidentTelephoneNo).clear();
        await this.page.locator(this.Elements.editIncidentTelephoneNo).fill(inputText);
        break;
      case 'Email':
        await this.page.locator(this.Elements.editIncidentEmail).clear();
        await this.page.locator(this.Elements.editIncidentEmail).fill(inputText);
        break;
      default:
        break;
    }
  }
}
