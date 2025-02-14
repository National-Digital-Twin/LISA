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
        incidents: ".incident-title",
        incidenceH1: ".title",
        closedIncidence: ".subtitle",
    }
    
    async verifyAddIncidentBtn() { 
        const button = this.page.getByRole('button', { name: this.Elements.addIncidentBtn });
        await expect(button).toBeVisible(); 
    }
    
    async checkClosedIncidentCheckBox() {
        const checkbox = this.page.getByLabel(this.Elements.includeClosedIncidents);
        expect(await checkbox.isChecked()).toBeFalsy();
        await checkbox.check();
        expect(await checkbox.isChecked()).toBeTruthy();
    }


    async verifyAllIncidenceDetailsAndCount() {
        const incidents = this.page.locator(this.Elements.incidents); 
        const incidentTexts = await incidents.allTextContents();     
        const allIncidenceText = await this.page.locator(this.Elements.incidenceH1).textContent();
        const closedIncidenceText = await this.page.locator(this.Elements.closedIncidence).innerText();    
        const activeIncidenceNumber = Number(allIncidenceText.match(/\d+/)[0]);
        const closedIncidenceNumber = Number(closedIncidenceText.match(/\d+/)[0]); 
        await this.page.waitForSelector(this.Elements.incidents, { state: 'visible' });
        await this.page.waitForSelector(this.Elements.closedIncidence, { state: 'visible' });
  
        const totalIncidents = activeIncidenceNumber + closedIncidenceNumber;
        const incidentCount = await incidents.count(); 
        // Validate total incidents
        expect(incidentCount).toEqual(totalIncidents);   
        // Validate date and title format
        const datePattern = /\d{1,2} \w{3,} \d{4}/;
        const titlePattern = /: .+/; 
        
        for (const text of incidentTexts) {
            expect(datePattern.test(text)).toBeTruthy();
            const titlePart = text.replace(datePattern, "").trim();   
            // Ensure there is something after the date
            expect(titlePart.length).toBeGreaterThan(0);   
            // Check if the title part has a colon and some description after it
            expect(titlePattern.test(titlePart)).toBeTruthy();
        }
    }
    
    async verifyActiveAndClosedTitleAreDisplayed() {
        const allIncidenceText = await this.page.locator(this.Elements.incidenceH1).textContent();
        const closedIncidenceText = await this.page.locator(this.Elements.closedIncidence).innerText();   
        const activeIncidenceNumber = allIncidenceText.match(/\d+/)[0];
        const closedIncidenceNumber = closedIncidenceText.match(/\d+/)[0];
        const uiH1IncidenceLocator  = await this.page.getByText(`${activeIncidenceNumber} active incidents( +${closedIncidenceNumber} closed )`)
        const uiH1IncidenceText = await uiH1IncidenceLocator.textContent();
        expect(allIncidenceText).toBe(uiH1IncidenceText);
        }   
}