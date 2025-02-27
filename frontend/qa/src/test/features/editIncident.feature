Feature: Edit Incident Page

  Background:
    Given I am a valid user logged into the "IRIS" NDTP application

    Scenario: Verify active and closed title are displayed on the l!sa dashboard
       And I select the Incident with name contains "22 Feb 2025: Terrorist attacks in venues and public spaces : TEST2" and Status as "Monitoring"
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

