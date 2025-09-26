import { Given, Then, When } from '@cucumber/cucumber';
import { basePage } from '../../hooks/basePage';
import CreateIncidentPage from '../../pages/createIncidentPage';
import { IncidentWorld } from '../../helper/util/world';
import IncidentDashboardPage from '../../pages/incidentDashboardPage';

let createIncidentPage: CreateIncidentPage;
let incidentDashboardPage: IncidentDashboardPage;

Given('I populate the new incident details', async () => {
  createIncidentPage = new CreateIncidentPage(basePage.page);
  await createIncidentPage.populateIncidentData();
});

Given('I populate the new incident details with timestamp', async () => {
  createIncidentPage = new CreateIncidentPage(basePage.page);
  await createIncidentPage.populateIncidentDataWithTimestamp();
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

Then('I should see the created incident in the incidents list', async function (this: IncidentWorld) {
  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.verifyIncidentInList(this.incidentName);
});

Then('I should not see the Add new incident button on the incidents list', async () => {
  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.verifyAddIncidentBtnNotVisible();
});