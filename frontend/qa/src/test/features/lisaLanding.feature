Feature: Lisa Landing Page

Scenario: Verify the Lisa Landing Page contains a dedicated Navigation Menu
    Given User login to the ndtp app with the user credentials
    When I click the "LISA" menu 
    Then I should be on the LISA dashboard page