Feature: Create Incident Page

  Background:
    Given I am a valid user logged into the "LISA" NDTP application
    And I have pressed add new incident

  @functional
  Scenario: LISA user can create a new incident
    Given I populate the new incident details
    When I click add new incident
    Then the page should load with the incident name in the header