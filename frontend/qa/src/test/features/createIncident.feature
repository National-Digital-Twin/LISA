Feature: Create Incident Page

  Background:
    Given I am a valid user logged into the "LISA" NDTP application

  @incident
  Scenario: Add incident button is not visible on incident list page
    When I navigate to the incident dashboard
    Then I should not see the Add new incident button on the incidents list

  @incident
  Scenario: Add incident button is visible on manage incidents page
    When I navigate to manage incidents page
    Then I should see Add new incident button displayed

  @incident
  @create-incident
  Scenario: LISA user can create a new incident with timestamped name
    Given I navigate to manage incidents page
    And I have pressed add new incident
    When I populate the new incident details with timestamp
    And I click add new incident
    Then the page should load with the incident name in the header
