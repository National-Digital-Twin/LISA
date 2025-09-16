import { expect, Page } from '@playwright/test';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';

const WAIT_TIMEOUT = Number(process.env.WAIT_TIMEOUT) || 500;
const CLICK_TIMEOUT = Number(process.env.CLICK_TIMEOUT) || 10000;

export default class IncidentDashboardPage {
  private readonly base: PlaywrightWrapper;

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  private readonly Elements = {
    addIncidentBtn: 'Add incident',
    sortFilterBtn: 'Sort & Filter',
    stageFilterBtn: 'Stage',
    closedCheckbox: 'Closed',
    incidentListItems: 'listitem',
    incidentsHeading: 'h1',
    editIncidentReferredBy: '//input[@id="referrer.name"]',
    editIncidentOrganisation: '//input[@id="referrer.organisation"]',
    editIncidentTelephoneNo: '//input[@id="referrer.telephone"]',
    editIncidentEmail: '//input[@id="referrer.email"]'
  };

  async verifyAddIncidentBtn() {
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    const button = this.page.getByRole('button', { name: this.Elements.addIncidentBtn });
    await expect(button).toBeVisible({ timeout: WAIT_TIMEOUT });
  }

  async clickClosedIncidentsChip() {
    // Click Sort & Filter button
    await this.page.getByRole('button', { name: this.Elements.sortFilterBtn }).click({ timeout: CLICK_TIMEOUT });
    await this.page.waitForTimeout(WAIT_TIMEOUT);

    // Click Stage filter
    await this.page.getByRole('button', { name: this.Elements.stageFilterBtn }).click({ timeout: CLICK_TIMEOUT });
    await this.page.waitForTimeout(WAIT_TIMEOUT);

    // Click Closed checkbox
    await this.page.getByRole('button', { name: this.Elements.closedCheckbox }).click({ timeout: CLICK_TIMEOUT });
    await this.page.waitForTimeout(WAIT_TIMEOUT);

    // Apply filter
    await this.page.getByRole('button', { name: 'Apply' }).click({ timeout: CLICK_TIMEOUT });
    await this.page.waitForTimeout(WAIT_TIMEOUT * 2);
  }

  async setClosedFilter(shouldInclude: boolean) {
    // Click Sort & Filter button
    await this.page.getByRole('button', { name: this.Elements.sortFilterBtn }).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);

    // Click Stage filter
    await this.page.getByRole('button', { name: this.Elements.stageFilterBtn }).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);

    // Check current state of Closed checkbox
    const closedCheckbox = this.page.locator('input[type="checkbox"]').filter({ hasText: this.Elements.closedCheckbox });
    const isChecked = await closedCheckbox.isChecked();

    if (isChecked !== shouldInclude) {
      await this.page.getByRole('button', { name: this.Elements.closedCheckbox }).click();
      await this.page.waitForTimeout(WAIT_TIMEOUT);
    }

    // Apply filter
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
  }

  async verifyAllIncidenceDetailsAndCount() {
    // Wait for incidents to load
    await this.page.waitForTimeout(WAIT_TIMEOUT * 4);

    // Count incident list items
    const incidentItems = this.page.locator(this.Elements.incidentListItems);
    const incidentCount = await incidentItems.count();

    // Verify we have incidents displayed
    expect(incidentCount).toBeGreaterThan(0);

    // Verify each incident has required information
    for (let i = 0; i < incidentCount; i++) {
      const incident = incidentItems.nth(i);
      await expect(incident).toContainText(/\w+/); // Has some text content
      await expect(incident).toContainText('Local User'); // Has user info
      await expect(incident).toContainText(/\d{1,2} \w{3} \d{4}/); // Has date format
    }
  }

  async verifyActiveAndClosedTitleAreDisplayed() {
    // Verify the main "Incidents" heading is displayed
    const incidentsHeading = this.page.locator(this.Elements.incidentsHeading);
    await expect(incidentsHeading).toContainText('Incidents');

    // Wait for incidents to load and verify we have incidents displayed
    const incidentItems = this.page.getByRole('listitem');
    await expect(incidentItems.first()).toBeVisible({ timeout: WAIT_TIMEOUT });
    const incidentCount = await incidentItems.count();

    expect(incidentCount).toBeGreaterThan(0);
  }

  async selectCreatedIncident(incidentName: string) {
    await this.page
      .getByRole('row', { name: new RegExp(`${incidentName}.*${process.env.TESTUSER}`, 'i') })
      .getByRole('link', { name: incidentName }).click();
  }

  async selectIncidentByData(incidentId: string, incidentName: string, incidentStatus: string) {
    if (incidentId || incidentStatus) {
      throw new Error('Needs to be implemented');
    }

    const incidentItems = this.page.locator(this.Elements.incidentListItems);
    const targetIncident = incidentItems.filter({ hasText: incidentName });
    await targetIncident.first().click();
  }

  async editIncidentByField(fieldName: string, inputText: string) {
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
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.page.getByRole('button', { name: this.Elements.addIncidentBtn }).click({ timeout: Number(process.env.CLICK_TIMEOUT) || 30000 });
  }

  async verifyAddIncidentBtnNotVisible() {
    // Should be on incidents dashboard page, not manage incidents
    const button = this.page.getByRole('button', { name: this.Elements.addIncidentBtn });
    await expect(button).not.toBeVisible({ timeout: 5000 });
  }

  async verifyIncidentInList(incidentName: string) {
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    // Wait a bit longer for the incident list to refresh after creation
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    const incidentItems = this.page.locator(this.Elements.incidentListItems);
    const targetIncident = incidentItems.filter({ hasText: incidentName });
    await expect(targetIncident.first()).toBeVisible({ timeout: WAIT_TIMEOUT });
  }
}
