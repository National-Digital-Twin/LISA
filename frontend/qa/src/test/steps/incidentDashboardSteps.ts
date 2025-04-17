import { Given, When, Then } from '@cucumber/cucumber';
import { basePage } from '../../hooks/basePage';
import IncidentDashboardPage from '../../pages/incidentDashboardPage';

let incidentDashboardPage: IncidentDashboardPage;

Given('I {string} include closed Incidents', async (negation: string) => {
  const shouldInclude = negation === 'do';

  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.setClosedFilter(shouldInclude);
});

Then('I should see Add new incident button displayed', async () => {
  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.verifyAddIncidentBtn();
});

Then('I should see all incidents displayed with the correct title format', async () => {
  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.verifyAllIncidenceDetailsAndCount();
});

When('I click on include closed incident', async () => {
  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.checkClosedIncidentCheckBox();
});

Then('I should see the number of active and closed incidents', async () => {
  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.verifyActiveAndClosedTitleAreDisplayed();
});

Given('I have pressed add new incident', async () => {
  incidentDashboardPage = new IncidentDashboardPage(basePage.page);
  await incidentDashboardPage.addNewIncident();
})