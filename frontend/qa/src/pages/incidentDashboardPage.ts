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
        incidents: ".incident-title"
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
    
        const incidents = this.page.locator(this.Elements.incidents); 
        const incidentTexts = await incidents.allTextContents();
    
        if (incidentTexts.length === 0) {
            return; 
        }
    
        const datePattern = /\d{1,2} \w{3,} \d{4}/;
        
        for (const text of incidentTexts) {
            expect(datePattern.test(text)).toBeTruthy(); 
            const titlePart = text.replace(datePattern, "").trim();
            expect(titlePart.length).toBeGreaterThan(0); 
        }
    
        const displayedCount = await incidents.count();
        expect(incidentTexts.length).toEqual(displayedCount);
    }
    
    
    
    
}