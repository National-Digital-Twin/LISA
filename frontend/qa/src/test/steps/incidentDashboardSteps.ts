import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { basePage } from "../../hooks/basePage";
import IncidentDashboardPage from "../../pages/incidentDashboardPage";

let incidentDashboardPage: IncidentDashboardPage;

Then('the Add new incident button should be visible', async function () {
      incidentDashboardPage = new IncidentDashboardPage(basePage.page);
      incidentDashboardPage.verifyAddIncidentBtn();

});
