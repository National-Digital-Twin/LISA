Feature: Incident Dashboard Page

  Background:
    Given I login to the ndtp app with the user credentials
    When I click the "LISA" menu

    Scenario: Verify active and closed title are displayed on the l!sa dashboard
        Then I should see the number of active and closed incidents  
        
    Scenario: Verify the Add new incident button is visible on the Lisa Incident Dashboard page
       Then I should see Add new incident button displayed

    Scenario: Verify all incidents are visible on the dashboard when checking the closed incidents checkbox
       When I click on include closed incident
       Then I should see all incidents displayed with the correct title format

      
    