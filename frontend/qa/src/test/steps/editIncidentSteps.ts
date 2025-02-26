import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';

import { basePage } from '../../hooks/basePage';
import IncidentDashboardPage from '../../pages/incidentDashboardPage';
import { RandomDataGenerator } from '../../helper/util/RandomDataGenerator';
import { base } from '@faker-js/faker/.';

let dashboardPage: IncidentDashboardPage;

setDefaultTimeout(60 * 1000 * 2);

Given(
  'I select the Incident with name contains {string} and Status as {string}',
  async (incidentName, incidentStatus) => {
    dashboardPage = new IncidentDashboardPage(basePage.page);
    dashboardPage.selectIncidentByNameStatus(incidentName, incidentStatus);

    await basePage.customSleep(3000);
  }
);

Given('I click the {string} menu in the {string} menu', async function (menuName, navMenu) {
  dashboardPage = new IncidentDashboardPage(basePage.page);
  basePage.navigateMenuByLink(navMenu);
  await basePage.customSleep(500);

  basePage.navigateMenuByButton(menuName);
  await basePage.customSleep(500);
});

When('I edit the Incident with below details', async function (dataTable) {
  // Convert the DataTable into an object with column names as keys
  const data = dataTable.rowsHash();

  // Edit the incident by checking the conditions for each field and using the RandomDataGenerator
  if (data['ReferredBy'] === 'Yes') {
    await dashboardPage.editIncidentByField(
      'ReferredBy',
      RandomDataGenerator.generateRandomFullName()
    );
  }

  if (data['Organisation'] === 'Yes') {
    await dashboardPage.editIncidentByField(
      'Organisation',
      RandomDataGenerator.generateRandomText(2) + ' Ltd'
    );
  }

  if (data['TelephoneNo'] === 'Yes') {
    await dashboardPage.editIncidentByField(
      'TelephoneNo',
      RandomDataGenerator.generateRandomTelephoneNumber()
    );
  }

  if (data['Email'] === 'Yes') {
    await dashboardPage.editIncidentByField('Email', RandomDataGenerator.generateRandomEmail());
  }

  if (data['SupportedReq'] === 'Yes') {
    await dashboardPage.editIncidentByField(
      'SupportedReq',
      RandomDataGenerator.generateRandomText()
    ); // Or any appropriate action
  }

  if (data['ReqDescription'] === 'Random text') {
    await dashboardPage.editIncidentByField(
      'ReqDescription',
      RandomDataGenerator.generateRandomText()
    );
  }
});

Then('I should be able to save the application successfully', async function () {
  basePage.navigateMenuByButton('Save');
  await basePage.customSleep(500);
});
