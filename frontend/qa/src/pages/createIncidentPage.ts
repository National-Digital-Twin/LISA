import { expect, Page } from '@playwright/test';
import PlaywrightWrapper from '../helper/wrapper/PlaywrightWrappers';
import { RandomDataGenerator } from '../helper/util/RandomDataGenerator';

const WAIT_TIMEOUT = Number(process.env.WAIT_TIMEOUT) || 500;
const CLICK_TIMEOUT = Number(process.env.CLICK_TIMEOUT) || 10000;

export default class CreateIncidentPage {
  private readonly base: PlaywrightWrapper;

  constructor(private readonly page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  private readonly Elements = {
    selectIncidentType: 'Select incident type',
    addDateTime: 'Add date and time',
    addIncidentName: 'Add incident name',
    referredBy: 'Referred by',
    organisation: 'Organisation',
    telephoneNumber: 'Telephone number',
    email: 'Email',
    supportRequested: 'Has the referrer requested support from the local resilience team?',
    saveButton: 'Save',
    cancelButton: 'Cancel'
  };

  incidentName: string;

  async populateIncidentData() {
    // Use the timestamped version for consistency
    await this.populateIncidentDataWithTimestamp();
  }

  async populateIncidentDataWithTimestamp() {
    // Generate timestamped incident name
    this.incidentName = `Automated Test Incident ${Date.now()}`;

    // Select incident type
    await this.page.getByText(this.Elements.selectIncidentType).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.page.getByRole('combobox', { name: 'Select incident type' }).click();
    await this.page.getByRole('option', { name: 'Storms' }).click();
    await this.clickConfirm();

    // Add incident name
    await this.page.getByText(this.Elements.addIncidentName).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.page.getByRole('textbox', { name: 'Incident name' }).fill(this.incidentName);
    await this.clickConfirm();

    // Fill referred by
    await this.page.getByText(this.Elements.referredBy).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.page.getByRole('textbox').fill(RandomDataGenerator.generateRandomFullName());
    await this.clickConfirm();

    // Fill organisation
    await this.page.getByText(this.Elements.organisation).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.page.getByRole('textbox').fill(`${RandomDataGenerator.generateRandomText(2)} Ltd`);
    await this.clickConfirm();

    // Fill telephone
    await this.page.getByText(this.Elements.telephoneNumber).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    // strip () not supported by the input field
    const telephoneNumber = RandomDataGenerator.generateRandomTelephoneNumber().replace(/[\(\)]/g, '');
    await this.page.getByRole('textbox').fill(telephoneNumber);
    await this.clickConfirm();

    // Fill email
    await this.page.getByText(this.Elements.email).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.page.getByRole('textbox').fill(RandomDataGenerator.generateRandomEmail());
    await this.clickConfirm();

    // Answer support requested question
    await this.page.getByText(this.Elements.supportRequested).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.page.getByRole('combobox', { name: 'Has the referrer requested' }).click();
    await this.page.getByRole('option', { name: 'No', exact: true }).click();
    await this.clickConfirm();

    // Add date and time
    await this.page.getByText(this.Elements.addDateTime).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    await this.page.getByRole('spinbutton', { name: 'Day' }).fill(day);
    await this.page.getByRole('spinbutton', { name: 'Month' }).fill(month);
    await this.page.getByRole('spinbutton', { name: 'Year' }).fill(year);
    await this.page.getByRole('spinbutton', { name: 'Hours' }).fill(hours);
    await this.page.getByRole('spinbutton', { name: 'Minutes' }).fill(minutes);
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    await this.clickConfirm();
  }

  private async clickConfirm() {
    const confirmBtn = this.page.getByRole('button', { name: 'Confirm' });
    await expect(confirmBtn).toBeVisible({ timeout: WAIT_TIMEOUT });

    const isEnabled = await confirmBtn.isEnabled();
    if (!isEnabled) {
      throw new Error('Confirm button is disabled!');
    }

    await confirmBtn.click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
  }

  async clickAddIncident() {
    const saveBtn = this.page.getByRole('button', { name: this.Elements.saveButton });
    await expect(saveBtn).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(saveBtn).toBeEnabled({ timeout: CLICK_TIMEOUT });
    await saveBtn.click();
  }

  async verifyIncidentLoaded() {
    await expect(this.page.getByText(this.incidentName)).toBeVisible({ timeout: WAIT_TIMEOUT });
    return this.incidentName;
  }

  async returnToDashboard() {
    // After saving, the app redirects to the incident logbook view
    // Click the INCIDENTS link to navigate back to the dashboard
    await this.page.getByRole('link', { name: 'INCIDENTS' }).click();
    await this.page.waitForTimeout(WAIT_TIMEOUT);
    // Wait for the incidents page heading to confirm we're on the dashboard
    await this.page.getByRole('heading', { name: 'Incidents' }).waitFor({ timeout: CLICK_TIMEOUT });
  }
}
