import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { launch } from "chrome-launcher";

export async function runLighthouse(url: string, outputDir = "test-results/lighthouse-reports") {
    // Launch a headless Chromium browser with debugging enabled
    const chrome = await launch({ chromeFlags: ["--headless"] });

    // Run Lighthouse on the given URL using the Chromium instance
     const result = await lighthouse(url, {
        port: chrome.port,
        output: ["json", "html"],
        logLevel: "info",
    });

    // Save the report
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save JSON and HTML reports
    const jsonReportPath = path.join(outputDir, "lighthouse-report.json");
    const htmlReportPath = path.join(outputDir, "liTghthouse-report.html");

    fs.writeFileSync(jsonReportPath, JSON.stringify(result.lhr, null, 2));
    fs.writeFileSync(htmlReportPath, result.report[1]); // HTML report

    console.log(`Lighthouse JSON report saved: ${jsonReportPath}`);
    console.log(`Lighthouse HTML report saved: ${htmlReportPath}`);

    await chrome.kill(); // Close Chromium after the test
    return result.lhr;
}
