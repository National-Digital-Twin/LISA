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
        await this.page.waitForSelector('.incident-title'); // Ensure elements are loaded
    
        const incidents = this.page.locator('.incident-title'); // Locate incidents
        const incidentTexts = await incidents.allTextContents(); // Extract text
    
        console.log("Extracted Incidents:", incidentTexts); // Debugging
    
        expect(incidentTexts.length).toBeGreaterThan(0); // Ensure incidents exist
    
        incidentTexts.forEach(text => {
            console.log("Incident Found:", text);
    
            const datePattern = /\d{1,2} \w{3,} \d{4}/; // Matches '11 Feb 2025'
            const hasDate = datePattern.test(text);
            expect(hasDate).toBeTruthy(); // Validate date
    
            const titlePart = text.replace(datePattern, "").trim();
            expect(titlePart.length).toBeGreaterThan(0); // Validate title
        });
    }
    
    
}