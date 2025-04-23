Feature: Edit Incident Page

  Background:
    Given I am a valid user logged into the "LISA" NDTP application

  @DPAV-562 @functional
  Scenario: Verify that a LISA user can edit the details of an existing Incident
    Given I have pressed add new incident
      And I populate the new incident details
      And I click add new incident
      And the page should load with the incident name in the header
    And I click the "Edit" menu in the "OVERVIEW" menu
      When I edit the Incident with below details
            | Field        | Value         |
            | ReferredBy   | Yes           |
            | Organisation | Yes           |
            | TelephoneNo  | Yes           |
            | Email        | Yes           |
            | SupportedReq | Yes           |
            | ReqDescription | Random text  |
      Then I should be able to save the application successfully

  @DPAV-570 @functional
  Scenario: Verify that a LISA user can create a log of 'general' category type with text and tagging a user
  Given I have pressed add new incident
      And I populate the new incident details
      And I click add new incident
      And the page should load with the incident name in the header
	And I proceed to add a Log entry page from the Incident Log page
  When I add the log details
      | tabName | logType | DescriptionTag | DescriptionText |
      | Form    | General | Yes            | Yes             |
    Then I should be able to verify a new log entry is created for the "General" category

  @functional @DPAV-573 @DPAV-591 @DPAV-587 @DPAV-592
	Scenario Outline: Verify that a LISA user can create a log of 'SitRep' category type, with text, plotting a point on the location tab and attaching a file 
		 Given I have pressed add new incident
      And I populate the new incident details
      And I click add new incident
      And the page should load with the incident name in the header
    And I proceed to add a Log entry page from the Incident Log page
		  When I add the log details
			  | tabName | logType | isIncidentDeclared | isOptionalFieldReq  | isLocationRequired   | isFileRequired |
			  | Form    | SitRep (M/ETHANE)  | Yes  | No                  | <isLocationRequired> | Yes |
    Then I should be able to verify a new log entry is created for the "SitRep" category
  Examples:
        |isLocationRequired|
        |Description only|
        |Point on a map|
        |Both a point on a map and a description|