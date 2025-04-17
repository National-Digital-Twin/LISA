import { Given, Then, When } from '@cucumber/cucumber';
import { basePage } from '../../hooks/basePage';
import CreateIncidentPage from '../../pages/createIncidentPage';

let createIncidentPage: CreateIncidentPage;

Given('I populate the new incident details', async () => {
  createIncidentPage = new CreateIncidentPage(basePage.page);
  await createIncidentPage.populateIncidentData();
});

When('I click add new incident', async () => {
  await createIncidentPage.clickAddIncident();
});

Then('the page should load with the incident name in the header', async () => {
  await createIncidentPage.verifyIncidentLoaded();
});