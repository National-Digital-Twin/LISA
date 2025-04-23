import { Given, Then, When } from '@cucumber/cucumber';
import { basePage } from '../../hooks/basePage';
import CreateIncidentPage from '../../pages/createIncidentPage';
import { IncidentWorld } from '../../helper/util/world';

let createIncidentPage: CreateIncidentPage;

Given('I populate the new incident details', async () => {
  createIncidentPage = new CreateIncidentPage(basePage.page);
  await createIncidentPage.populateIncidentData();
});

When('I click add new incident', async () => {
  await createIncidentPage.clickAddIncident();
});

Then('the page should load with the incident name in the header', async function scrapeName (this: IncidentWorld) {
  this.incidentName = await createIncidentPage.verifyIncidentLoaded();
});

When('I click Incidents to return to the dashboard', async () => {
  await createIncidentPage.returnToDashboard();
});