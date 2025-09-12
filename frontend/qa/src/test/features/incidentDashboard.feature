Feature: Incident Dashboard Page

  Background:
    Given I am a valid user logged into the "LISA" NDTP application
    And I navigate to the incident dashboard

    Scenario: Verify incidents dashboard displays incidents list
        Then I should see the number of active and closed incidents  

    Scenario: Verify the Add incident button is visible on the Manage Incidents page
       Then I should see Add new incident button displayed

    Scenario: Verify all incidents are visible when including closed incidents
       When I click on include closed incident
       Then I should see all incidents displayed with the correct title format

      
    