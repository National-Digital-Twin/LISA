Feature: Lisa Landing Page

Background:
    Given I login to the ndtp app with the user credentials

@functional @US_DPAV-342 @DPAV-612
Scenario: Verify the Landing Page should navigate to LISA NDTP through the menu link
    When I click the LISA menu 
    Then I should be on the LISA dashboard page

@functional @US_DPAV-342 @DPAV-612 
Scenario: Verify the Landing Page should navigate to LISA application through the direct NDTP link launch
    When I launch the LISA NDTP direct link with "successful" login
    Then I should be on the LISA dashboard page