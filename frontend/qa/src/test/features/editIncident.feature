Feature: Edit Incident Page

  Background:
    Given I am a valid user logged into the "IRIS" NDTP application

    @DPAV-562 @functional
    Scenario: Verify active and closed title are displayed on the l!sa dashboard
      And I select the Incident from the incident list
          |incidentId|incidentName|incidentStatus|
          |38fe39ff-1625-4115-bd76-1464770eb803|Rob|MONITORING|
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
  And I select the Incident from the incident list
      |incidentId|incidentName|incidentStatus|
      |38fe39ff-1625-4115-bd76-1464770eb803|Rob|MONITORING|
	And I proceed to add a Log entry page from the Incident Log page
  When I add the log details
      | tabName | logType | DateTime | DescriptionTag | DescriptionText |
      | Form    | General | Now      | Yes            | Yes             |
    Then I should be able to verify a new log entry is created for the "General" category

  @functional @DPAV-573 @DPAV-591 @DPAV-587 @DPAV-592
	Scenario Outline: Verify that a LISA user can create a log of 'SitRep' category type, with text, plotting a point on the location tab and attaching a file 
		 And I select the Incident from the incident list
      |incidentId|incidentName|incidentStatus|
      |38fe39ff-1625-4115-bd76-1464770eb803|Rob|MONITORING|
			And I proceed to add a Log entry page from the Incident Log page
		  When I add the log details
			  | tabName | logType | DateTime | isIncidentDeclared | isOptionalFieldReq | isLocationRequired|isFileRequired|
			  | Form    | SitRep | Now      | Yes,MajorIncident| No             | <isLocationRequired>|Yes|
      Then I should be able to verify a new log entry is created for the "SitRep" category
  Examples:
        |isLocationRequired|
        |Description only|
        |Point on a map|
        |Both a point on a map and a description|