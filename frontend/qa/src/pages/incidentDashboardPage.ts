import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class IncidentDashboardPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        addIncidentBtn: "Add new incident",
    }
    
    async verifyAddIncidentBtn() { 
        const button = this.page.getByRole('button', { name: this.Elements.addIncidentBtn });
        await expect(button).toBeVisible(); 
    }


}