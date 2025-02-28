import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';

import { basePage } from '../../hooks/basePage';
import IncidentDashboardPage from '../../pages/incidentDashboardPage';
import { RandomDataGenerator } from '../../helper/util/RandomDataGenerator';
import EditIncidentLogPage from '../../pages/editIncidentLogPage';

let dashboardPage: IncidentDashboardPage;
let incidentEditLogPage : EditIncidentLogPage;

setDefaultTimeout(60 * 1000 * 2);

Given(
  'I select the Incident with name contains {string} and Status as {string}',
  async (incidentName, incidentStatus) => {
    dashboardPage = new IncidentDashboardPage(basePage.page);
    await dashboardPage.selectIncidentByNameStatus(incidentName, incidentStatus);

    await basePage.customSleep(3000);
  }
);

Given('I click the {string} menu in the {string} menu', async (menuName, navMenu) => {
  dashboardPage = new IncidentDashboardPage(basePage.page);
  await basePage.navigateMenuByLink(navMenu);
  await basePage.customSleep(500);

  await basePage.navigateMenuByButton(menuName);
  await basePage.customSleep(500);
});

When('I edit the Incident with below details', async (dataTable) => {
  // Convert the DataTable into an object with column names as keys
  const data = dataTable.rowsHash();

  // Edit the incident by checking the conditions for each field and using the RandomDataGenerator
  if (data.ReferredBy === 'Yes') {
    await dashboardPage.editIncidentByField(
      'ReferredBy',
      RandomDataGenerator.generateRandomFullName()
    );
  }

  if (data.Organisation === 'Yes') {
    await dashboardPage.editIncidentByField(
      'Organisation',
      `${RandomDataGenerator.generateRandomText(2)} Ltd`
    );
  }

  if (data.TelephoneNo === 'Yes') {
    await dashboardPage.editIncidentByField(
      'TelephoneNo',
      RandomDataGenerator.generateRandomTelephoneNumber()
    );
  }

  if (data.Email === 'Yes') {
    await dashboardPage.editIncidentByField('Email', RandomDataGenerator.generateRandomEmail());
  }

  if (data.SupportedReq === 'Yes') {
    await dashboardPage.editIncidentByField(
      'SupportedReq',
      RandomDataGenerator.generateRandomText()
    ); // Or any appropriate action
  }

  if (data.ReqDescription === 'Random text') {
    await dashboardPage.editIncidentByField(
      'ReqDescription',
      RandomDataGenerator.generateRandomText()
    );
  }
});

Then('I should be able to save the application successfully', async () => {
  await basePage.navigateMenuByButton('Save');
  await basePage.customSleep(500);
});

Given('I proceed to add a Log entry page from the Incident Log page', async () => {
  incidentEditLogPage = new EditIncidentLogPage(basePage.page);
  await basePage.customSleep(1000);
  await incidentEditLogPage.verifyPageTitle();
  process.env.getLogEntriesCount = (await incidentEditLogPage.setLogStatusByCount()).toString();
  await incidentEditLogPage.btnClickAddLogEntry();
});

When('I add the log details', async (dataTable) => {
  const data = dataTable.rows()[0];

  incidentEditLogPage = new EditIncidentLogPage(basePage.page);
  await incidentEditLogPage.updateLogByTab(await data[0]);
  await incidentEditLogPage.updateLogTabFormType(await data[1]);
  await incidentEditLogPage.updateLogTabFormDateTimeNow(await data[2]);
  await incidentEditLogPage.updateLogTabFormDesc(data[3] === 'Yes', data[4] === 'Yes');
  await incidentEditLogPage.btnAddLogSave();
});

Then('I should be able to verify a new log entry is created for the {string} category', async (logType) => {
  // eslint-disable-next-line no-console
  console.warn(`Verify a new entry is included for the log entry :${logType}`);
  incidentEditLogPage = new EditIncidentLogPage(basePage.page);
  await incidentEditLogPage.verifyLogStatusByCount(parseInt(process.env.getLogEntriesCount, 10));
});
