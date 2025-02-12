import { Given, When, setDefaultTimeout } from "@cucumber/cucumber";

import { basePage } from "../../hooks/basePage";
import LoginPage from "../../pages/loginPage";
import LandingPage from "../../pages/landingPage";

let loginPage: LoginPage;
let landingPage : LandingPage;

setDefaultTimeout(60 * 1000 * 2)


Given('I login to the ndtp app with the user credentials', async function () {
      loginPage = new LoginPage(basePage.page);
    await loginPage.navigateToLoginPage(process.env.BASEURL);
    basePage.logger.info("Navigated to the application");
    await loginPage.loginUser(process.env.USERNAME, process.env.PASSWORD);

});


When('I click the {string} menu', async function (menuName) {
    landingPage = new LandingPage(basePage.page);
    await landingPage.clickMenuByName(menuName);
})
