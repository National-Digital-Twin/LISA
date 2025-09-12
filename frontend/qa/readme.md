# Playwright + Cucumber (BDD)

Cucumber is a popular behavior-driven development (BDD) tool that allows developers and stakeholders to collaborate on defining and testing application requirements in a human-readable format.
TypeScript is a powerful superset of JavaScript that adds optional static typing, making it easier to catch errors before runtime. By combining these two tools, we can create more reliable and maintainable tests.

## Framework Features

1. Awesome report with screenshots, videos & logs
2. Execute tests on multiple environments
3. Parallel execution
4. Rerun only failed features
5. Retry failed tests on CI
6. Github Actions integrated with downloadable report
7. Page object model

## Project structure

- .github -> yml file to execute the tests in GitHub Actions
- src -> Contains all the features & Typescript code
- test-results -> Contains all the reports related file

## Reports

1. [Mutilple Cucumber Report](https://github.com/WasiqB/multiple-cucumber-html-reporter)
2. Default Cucumber report
3. [Logs](https://www.npmjs.com/package/winston)
4. Screenshots of failure
5. Test videos of failure
6. Trace of failure

## Get Started

node js needs to be latest or minimum version 22

### Setup:

1. Clone or download the project
2. Extract and open in the VS-Code
3. `npm i` to install the dependencies
4. `npx playwright install` to install the browsers
5. Get the Test User login details from the secret vault in Kubernetes. If it hasn't been created for this enviroment, refer to [Setting Up a new Test User](#setting-up-a-new-test-user) below.
6. Populate the `TESTUSER` and `TESTPASS` values in the env file with the appropriate values
7. Populate the `BASEURL` and `LISAURL` values with the appropriate URLs
8. `cd frontend/qa` to get to the relevant folder
9. `ENV=dev npx cucumber-js -c config/cucumber.js` to run the tests, replacing the ENV value with whichever environment you are targeting (this directly drives which env file it will use)

### Running Tests Locally:

For local development, you can run tests against your local instance without going through the full login process:

1. Make sure your local frontend is running on `http://localhost:5173` (use `npm run dev` in the frontend folder)
2. Make sure your local backend is running on `http://localhost:3000` (the backend auto-authenticates in development mode)
3. `cd frontend/qa` to get to the relevant folder
4. `npm run test:local` to run the tests against your local environment

The local configuration (`.env.local`) is pre-configured to:
- Point to `http://localhost:5173` for both BASEURL and LISAURL
- Skip the login process since the backend auto-authenticates in development mode
- Use a mock local user for any user-related operations

You can run specific scenarios by using tasks, e.g `ENV=local npx cucumber-js --config=config/cucumber.js --tags "@create-incident`

### Folder structure

0. `src\pages` -> All the page (UI screen)
1. `src\test\features` -> write your features here
2. `src\test\steps` -> Your step definitions goes here
3. `src\hooks\hooks.ts` -> Browser setup and teardown logic
4. `src\hooks\basePage.ts` -> Commonly shared page objects to steps
5. `src\helper\env` -> Multiple environments are handled
6. `src\helper\types` -> To get environment code suggestions
7. `src\helper\report` -> To generate the report
8. `config/cucumber.js` -> One file to do all the magic
9. `package.json` -> Contains all the dependencies
10. `src\helper\auth` -> Storage state (Auth file)
11. `src\helper\util` -> Read test data from json & logger

### Setting up a new Test User

1. Run AWS login in your CLI
2. Once logged in, populate the below tokens with appropriate replacements and run the below two commands:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <user-pool-id> \
  --username <email> \
  --user-attributes Name=email,Value=<email> \
                   Name=email_verified,Value=true \
  --temporary-password "InitialPassword1" \
  --message-action SUPPRESS`
```

```bash
aws cognito-idp admin-set-user-password \
  --user-pool-id <user-pool-id> \
  --username <email> \
  --password "<new-secure-password>" \
  --permanent
```

3. Once those have been run, login to AWS Cognito, navigate to the relevant user pool and find the new user.
4. Add a new Attribute for the user with the name "name" - give the test user an appropriate value for this. eg. "Test_User"
5. Add the new test user to the relevant roles for access to the applications
6. Add the new test username and password to the secret vault in Kubernetes as TESTUSER and TESTPASS

# Performance testing

npx lighthouse --version

Check if Chrome is installed
sudo apt update
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb

--Check chrome installation
google-chrome --version


© Crown Copyright 2025. This work has been developed by the National Digital Twin Programme and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
Licensed under the Open Government Licence v3.0.
