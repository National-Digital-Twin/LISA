import { expect, Page } from '@playwright/test';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';
import { RandomDataGenerator } from '../helper/util/RandomDataGenerator';

export default class CreateIncidentPage {
  private readonly base: PlaywrightWrapper;

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  private readonly Elements = {
    incidentName: '//input[@id="name"]',
    incidentReferredBy: '//input[@id="referrer.name"]',
    incidentOrganisation: '//input[@id="referrer.organisation"]',
    incidentTelephoneNo: '//input[@id="referrer.telephone"]',
    incidentEmail: '//input[@id="referrer.email"]',
    incidentAddNowName: '< Now',
    incidentTypeNearbyLabel: 'Incident type',
    incidentSupportRequestedNearbyLabel: 'Has the referrer requested support from the local resilience team?',
    selectComponentPlaceholderText: 'Select',
    addNewIncidentButtonText: 'Create Incident Log'
  };

  incidentName: string;

  async populateIncidentData() {
    // Incident Type
    await this.page.getByText(this.Elements.incidentTypeNearbyLabel).locator('..').getByPlaceholder(this.Elements.selectComponentPlaceholderText).click();
    await this.page.getByRole('option', { name: 'Storms' }).click();

    // Main input fields
    this.incidentName = `Regression Test Incident: ${RandomDataGenerator.generateRandomText(2)}`;
    await this.page.locator(this.Elements.incidentName).fill(this.incidentName);
    await this.page.getByRole('button', {name: this.Elements.incidentAddNowName }).click();
    await this.page.locator(this.Elements.incidentReferredBy).fill(RandomDataGenerator.generateRandomFullName());
    await this.page.locator(this.Elements.incidentOrganisation).fill(`${RandomDataGenerator.generateRandomText(2)} Ltd`);
    await this.page.locator(this.Elements.incidentTelephoneNo).fill(RandomDataGenerator.generateRandomTelephoneNumber());
    await this.page.locator(this.Elements.incidentEmail).fill(RandomDataGenerator.generateRandomEmail());

    // Support Required?
    await this.page.getByText(this.Elements.incidentSupportRequestedNearbyLabel).locator('..').getByPlaceholder(this.Elements.selectComponentPlaceholderText).click();
    await this.page.getByRole('option', { name: 'No' }).click();
  }

  async clickAddIncident() {
    const createBtn = this.page.getByRole('button', { name: this.Elements.addNewIncidentButtonText });
    await expect(createBtn).toBeVisible({ timeout: 5000 });
    await expect(createBtn).toBeEnabled();
    await createBtn.click();
  }

  async verifyIncidentLoaded() {
    await expect(this.page.getByText(this.incidentName)).toBeVisible({ timeout: 60000 });
    return this.incidentName;
  }

  async returnToDashboard() {
    await this.page.getByRole('link', { name: 'INCIDENTS' }).click();
    await this.page.getByRole('button', { name: 'Add new incident' }).waitFor();
  }
}
