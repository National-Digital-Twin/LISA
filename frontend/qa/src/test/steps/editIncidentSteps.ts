import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';

import { basePage } from '../../hooks/basePage';
import IncidentDashboardPage from '../../pages/incidentDashboardPage';
import { RandomDataGenerator } from '../../helper/util/RandomDataGenerator';
import EditIncidentLogPage from '../../pages/editIncidentLogPage';
import LandingPage from '../../pages/landingPage';
import { IncidentWorld } from '../../helper/util/world';
import { LogEntrySelectType } from '../../helper/util/enums';

let landingPage: LandingPage;
let dashboardPage: IncidentDashboardPage;
let incidentEditLogPage: EditIncidentLogPage;

setDefaultTimeout(60 * 1000 * 2);

Given('I select the created Incident from the incident list',
  async function getIncident (this: IncidentWorld) {
    dashboardPage = new IncidentDashboardPage(basePage.page);

    await basePage.customSleep(5000);

    await dashboardPage.selectCreatedIncident(this.incidentName);

    await basePage.customSleep(3000);
  }
);

When('I select the Incident from the incident list', async (dataTable) => {
  const data = dataTable.rows()[0];

  dashboardPage = new IncidentDashboardPage(basePage.page);
  await dashboardPage.selectIncidentByData(await data[0], await data[1], await data[2]);
});

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
  await basePage.customSleep(2000);
  process.env.getLogEntriesCount = (await incidentEditLogPage.setLogStatusByCount()).toString();
  await incidentEditLogPage.btnClickAddLogEntry();
});

When('I add the log details', async (dataTable) => {
  const data = dataTable.rows()[0];

  incidentEditLogPage = new EditIncidentLogPage(basePage.page);
  await incidentEditLogPage.updateLogByTab(await data[0]);
  await incidentEditLogPage.updateDropDownById(await data[1], LogEntrySelectType.logType);
  await incidentEditLogPage.updateLogTabFormDateTimeNow();

  switch (data[1]) {
    case 'General': {
      await incidentEditLogPage.updateLogTabFormDesc(data[2] === 'Yes', data[3] === 'Yes');
      break;
    }
    case 'SitRep (M/ETHANE)': {
      await incidentEditLogPage.updateDropDownById(data[2], LogEntrySelectType.majorIncidentDeclared);
      await incidentEditLogPage.updateSitRepTextFields(data[3] === 'Yes');
      await incidentEditLogPage.setSitRepLocation(data[4]);
      await incidentEditLogPage.doFileUpload(data[5]);
      break;
    }
    default: {
      // eslint-disable-next-line no-console
      console.log('No Matching dropdown types');
    }
  }

  basePage.customSleep(10000)

  await incidentEditLogPage.btnAddLogSave();
});

Then(
  'I should be able to verify a new log entry is created for the {string} category',
  async (logType) => {
    /* eslint-disable no-console */
    console.warn(`Verify a new entry is included for the log entry :${logType}`);
    incidentEditLogPage = new EditIncidentLogPage(basePage.page);
    await incidentEditLogPage.verifyLogStatusByCount(parseInt(process.env.getLogEntriesCount, 10));
  }
);

When('I update the Incident stage', async (dataTable) => {
  const data = dataTable.rows()[0];

  incidentEditLogPage = new EditIncidentLogPage(basePage.page);
  await incidentEditLogPage.updateDropDownById(await data[0]);

  await incidentEditLogPage.btnAddLogSave();
});

Then('I should be able to verify the stage details as {string}', async (newStage: string) => {
  await basePage.customSleep(1000);

  incidentEditLogPage = new EditIncidentLogPage(basePage.page);
  await basePage.navigateMenuByLink('LOG');

  await basePage.customSleep(5000);
  await incidentEditLogPage.verifyUpdatedStage(newStage);
});

Then(
  'I reset the stage back for the incident name {string} from {string} to {string}',
  async (incidentName: string, newStage: string, initalStage: string) => {
    landingPage = new LandingPage(basePage.page);
    await landingPage.verifyLisaAppPage();

    dashboardPage = new IncidentDashboardPage(basePage.page);
    await basePage.customSleep(5000);
    await dashboardPage.selectCreatedIncident(incidentName);

    await basePage.navigateMenuByLink('OVERVIEW');
    await basePage.customSleep(500);

    await basePage.navigateMenuByButton('Change stage');
    await basePage.customSleep(500);

    incidentEditLogPage = new EditIncidentLogPage(basePage.page);
    await incidentEditLogPage.updateDropDownById(initalStage);

    await incidentEditLogPage.btnAddLogSave();
  }
);
