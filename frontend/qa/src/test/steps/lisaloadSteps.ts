import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { runLighthouse } from "../../helper/wrapper/runLighthouse";

let lighthouseReport: any;

When("I run Lighthouse analysis for {string}", async function (url) {
    lighthouseReport = await runLighthouse(url);
});

When("I run Lighthouse analysis for lisa {string} page", async function (pageName) {
    lighthouseReport = await runLighthouse(pageName);
});

Then("the performance score should be at least {int}", function (threshold: number) {
    const performanceScore = lighthouseReport.categories.performance.score * 100;
    console.log(`Performance Score: ${performanceScore}`);
    expect(performanceScore).toBeGreaterThanOrEqual(threshold);
});
