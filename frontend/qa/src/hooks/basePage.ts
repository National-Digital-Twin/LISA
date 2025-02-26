import { Page } from '@playwright/test';
import { Logger } from 'winston';

export const basePage = {
  page: undefined as Page,
  logger: undefined as Logger,

  // Custom sleep function
  async customSleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  async navigateMenuByLink(menuName: string) {
    await this.page.getByRole('link', { name: menuName }).click();
  },

  async navigateMenuByButton(menuName: string) {
    await this.page.getByRole('button', { name: menuName }).click();
  }
};
