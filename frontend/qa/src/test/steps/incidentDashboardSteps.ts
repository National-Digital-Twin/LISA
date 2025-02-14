import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { basePage } from "../../hooks/basePage";
import IncidentDashboardPage from "../../pages/incidentDashboardPage";

let incidentDashboardPage: IncidentDashboardPage;

Then('I should see Add new incident button displayed', async function () {
      incidentDashboardPage = new IncidentDashboardPage(basePage.page);
      incidentDashboardPage.verifyAddIncidentBtn();

});

Then('I should see all incidents displayed with the correct title format', async function () {
    incidentDashboardPage = new IncidentDashboardPage(basePage.page);
    incidentDashboardPage.verifyAllIncidenceDetailsAndCount();

});

When('I click on include closed incident', async function () {
    incidentDashboardPage = new IncidentDashboardPage(basePage.page);
    incidentDashboardPage.checkClosedIncidentCheckBox();
});

Then('I should see the number of active and closed incidents', async function () {
    incidentDashboardPage = new IncidentDashboardPage(basePage.page);
    incidentDashboardPage.verifyActiveAndClosedTitleAreDisplayed();

});
