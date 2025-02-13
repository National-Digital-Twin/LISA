Feature: Lisa Landing Page

Background:
    Given User login to the ndtp app with the user credentials
    When I click the "LISA" menu 

@functional
Scenario: Verify the Lisa Landing Page contains a dedicated Navigation Menu
    Then I should be on the LISA dashboard page