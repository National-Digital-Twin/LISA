import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class IncidentDashboardPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        addIncidentBtn: "Add new incident",
        incidentItems: "a.incident",
        includeClosedIncidents: "Include closed incidents",
    }
    
    async verifyAddIncidentBtn() { 
        const button = this.page.getByRole('button', { name: this.Elements.addIncidentBtn });
        await expect(button).toBeVisible(); 
    }

    async verifyIncidentsArePresent() {
        const incidents = await this.page.locator(this.Elements.incidentItems).count();
        expect(incidents).toBeGreaterThan(0);
    }
    
    async checkClosedIncidentCheckBox(){
        await this.page.getByLabel(this.Elements.includeClosedIncidents).check(); 
    }

    async verifyIncidentDetails() {
        await this.page.waitForSelector('.incident-title'); 
    
        const incidents = this.page.locator('.incident-title'); 
        const incidentTexts = await incidents.allTextContents(); 
    
        console.log("Extracted Incidents:", incidentTexts); 
    
        expect(incidentTexts.length).toBeGreaterThan(0); 
    
        incidentTexts.forEach(text => {
            console.log("Incident Found:", text);
    
            const datePattern = /\d{1,2} \w{3,} \d{4}/; 
            const hasDate = datePattern.test(text);
            expect(hasDate).toBeTruthy(); 
            const titlePart = text.replace(datePattern, "").trim();
            expect(titlePart.length).toBeGreaterThan(0); 
        });
    }
    
    
}