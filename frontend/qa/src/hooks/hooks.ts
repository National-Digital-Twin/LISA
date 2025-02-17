import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { Browser, BrowserContext } from '@playwright/test';
import { createLogger } from 'winston';
import fs from 'fs-extra';
import { basePage } from './basePage';
import { invokeBrowser } from '../helper/browsers/browserManager';
import { getEnv } from '../helper/env/env';
import { options } from '../helper/util/logger';

let browser: Browser;
let context: BrowserContext;

function getStorageState(user: string):
  | string
  | {
      cookies: {
        name: string;
        value: string;
        domain: string;
        path: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'Strict' | 'Lax' | 'None';
      }[];
      origins: { origin: string; localStorage: { name: string; value: string }[] }[];
    } {
  if (user.endsWith('admin')) return 'src/helper/auth/admin.json';
  if (user.endsWith('lead')) return 'src/helper/auth/lead.json';
  return '';
}

BeforeAll(async () => {
  getEnv();
  browser = await invokeBrowser();
});
// It will trigger for not auth scenarios
Before({ tags: 'not @auth' }, async ({ pickle }) => {
  const scenarioName = pickle.name + pickle.id;
  context = await browser.newContext({
    recordVideo: {
      dir: 'test-results/videos'
    }
  });
  await context.tracing.start({
    name: scenarioName,
    title: pickle.name,
    sources: true,
    screenshots: true,
    snapshots: true
  });
  basePage.page = await context.newPage();
  basePage.logger = createLogger(options(scenarioName));
});

// It will trigger for auth scenarios
Before({ tags: '@auth' }, async ({ pickle }) => {
  const scenarioName = pickle.name + pickle.id;
  context = await browser.newContext({
    storageState: getStorageState(pickle.name),
    recordVideo: {
      dir: 'test-results/videos'
    }
  });
  await context.tracing.start({
    name: scenarioName,
    title: pickle.name,
    sources: true,
    screenshots: true,
    snapshots: true
  });
  basePage.page = await context.newPage();
  basePage.logger = createLogger(options(scenarioName));
});

After(async function TestCaseHook({ pickle, result }) {
  let videoPath: string;
  let img: Buffer;
  const path = `./test-results/trace/${pickle.id}.zip`;
  if (result?.status === Status.PASSED) {
    img = await basePage.page.screenshot({
      path: `./test-results/screenshots/${pickle.name}.png`,
      type: 'png'
    });
    videoPath = await basePage.page.video().path();
  }
  await context.tracing.stop({ path });
  await basePage.page.close();
  await context.close();
  if (result?.status === Status.PASSED) {
    this.attach(img, 'image/png');
    this.attach(fs.readFileSync(videoPath), 'video/webm');
    const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`;
    this.attach(`Trace file: ${traceFileLink}`, 'text/html');
  }
});

AfterAll(async () => {
  await browser.close();
});
