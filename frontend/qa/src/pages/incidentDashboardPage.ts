import { expect, Page } from '@playwright/test';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';

export default class IncidentDashboardPage {
  private readonly base: PlaywrightWrapper;

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  private readonly Elements = {
    addIncidentBtn: 'Add new incident',
    incidents: '.incident-title',
    incidentH1: '.title',
    closedIncident: '.subtitle',
    selectIncidentByNameStatus:
      "//tr[td[contains(text(),'$DATAINCIDENTID$')] and td[5]//span[contains(text(),'$DATASTATUS$')]]//a[@data-discover='true' and contains(text(),'$DATAINCIDENTNAME$')]",

    editIncidentReferredBy: '//input[@id="referrer.name"]',
    editIncidentOrganisation: '//input[@id="referrer.organisation"]',
    editIncidentTelephoneNo: '//input[@id="referrer.telephone"]',
    editIncidentEmail: '//input[@id="referrer.email"]',
    chipCloseIncidents: '//input[@id="Closed"]'
  };

  async verifyAddIncidentBtn() {
    const button = this.page.getByRole('button', { name: this.Elements.addIncidentBtn });
    await expect(button).toBeVisible();
  }

  async clickClosedIncidentsChip() {
    await this.page.getByRole('button', { name: 'Closed' }).click();
  }

  async setClosedFilter(shouldInclude: boolean) {
    const chiplocator = this.page.locator(this.Elements.chipCloseIncidents);
    
    const isActive = await chiplocator.getAttribute('class').then(cls =>
      cls?.includes('Mui-selected') || cls?.includes('MuiChip-clickable')
    );

    if (isActive !== shouldInclude) {
      await chiplocator.click();
    }
  }

  async verifyAllIncidenceDetailsAndCount() {
    const incidentRows = await this.page.locator('table.MuiTable-root tbody tr');
    const incidentCount = await incidentRows.count();

    const closedIncidentText = await this.page.locator('h2.MuiTypography-h2').textContent();
    const closedIncidentNumber = Number(/\d+/.exec(closedIncidentText)?.[0] ?? 0);

    expect(incidentCount).toEqual(closedIncidentNumber)
  }

  async verifyActiveAndClosedTitleAreDisplayed() {
    const allIncidentText = await this.page.locator('h1.MuiTypography-h1.title').textContent();;
    const closedIncidentText = await this.page.locator('h2.MuiTypography-h2').textContent();

    const activeIncidentNumber = /\d+/.exec(allIncidentText)?.[0] ?? 0;
    const match = /\d+/.exec(closedIncidentText);
    const closedIncidentNumber = match ? `+${match[0]}` : "None";

    const uiH1IncidentText = await this.page.getByText(`${activeIncidentNumber} active incidents`).textContent();
    const uiH2IncidentText = await this.page.getByText(`(${closedIncidentNumber} closed)`).textContent();
    
    expect(allIncidentText).toBe(uiH1IncidentText);
    expect(closedIncidentText).toBe(uiH2IncidentText);
  }

  async selectCreatedIncident(incidentName: string) {
    await this.page
      .getByRole('row', { name: new RegExp(`${incidentName}.*${process.env.TESTUSER}`, 'i') })
      .getByRole('link', { name: incidentName }).click();
  }

  async selectIncidentByData(incidentId: string, incidentName: string, incidentStatus: string) {
    await this.page
      .locator(
        this.Elements.selectIncidentByNameStatus
          .replace('$DATAINCIDENTID$', incidentId)
          .replace('$DATASTATUS$', incidentStatus)
          .replace('$DATAINCIDENTNAME$', incidentName)
      )
      .click();
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

  async addNewIncident() {
    await this.page.getByRole('button', { name: this.Elements.addIncidentBtn }).click();
  }
}
