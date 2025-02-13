Feature: Incident Dashboard Page

  Background:
    Given User login to the ndtp app with the user credentials
    When I click the "LISA" menu
  Scenario: Verify the Add new incident button is visible on the Lisa Incident Dashboard page
     Then the Add new incident button should be visible

  Scenario: Verify incidence is visible on the dashboard
       When I click on include closed incident
       Then Incidents are displayed on the dashboard  
    