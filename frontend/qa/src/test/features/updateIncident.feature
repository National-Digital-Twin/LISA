Feature: Update Incident Page

  Background:
    Given I am a valid user logged into the "LISA" NDTP application
    And I "do" include closed Incidents

    @DPAV-600 @functional
    Scenario Outline: Verify active and closed title are displayed on the l!sa dashboard
      And I select the Incident with name contains "<incidentName>" and Status as "<initialStage>"
      And I click the "Change stage" menu in the "OVERVIEW" menu
      When I update the Incident stage
      |incidentStage|
      |<newStage>|
      Then I should be able to verify the stage details as "<newStage>"
      Then I reset the stage back for the incident name "<incidentName>" from "<newStage>" to "<initialStage>"
    Examples:
    |incidentName|initialStage|newStage|
    |Northern Ireland related terrorism : wqqw|Monitoring|Recovery|
    |Northern Ireland related terrorism : wq|Monitoring|Response|
    |Major maritime pollution incident : Test|Monitoring|Closed|