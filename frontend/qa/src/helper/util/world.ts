import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Page } from '@playwright/test';

export class IncidentWorld extends World {
  page!: Page;

  incidentName?: string;

  incidentId?: string;
}

setWorldConstructor(IncidentWorld);
