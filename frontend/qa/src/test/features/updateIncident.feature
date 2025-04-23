Feature: Update Incident Page

  Background:
    Given I am a valid user logged into the "LISA" NDTP application
      And I have pressed add new incident
      And I populate the new incident details
      And I click add new incident
      And the page should load with the incident name in the header

  @functional @DPAV-600
  Scenario Outline: Verify stage changes can be made against an Incident
  Given I click the "Change stage" menu in the "OVERVIEW" menu
    When I update the Incident stage
    |incidentStage|
    |<newStage>|
    Then I should be able to verify the stage details as "<newStage>"
    Examples:
    |newStage|
    |Recovery|