@popcount @regression
Feature: ISR POPCOUNT Screen Content Validation

  Scenario: ISR POPCOUNT Screen Number of People and Help Text Validation
    Given the responder is on the Census login page
    When the responder enters the Census ID "CENSUS_ID_VALID_1"
    And the responder clicks the Login button
    Then the responder is navigated to the Confirm page
    When the responder selects Yes
    And the responder clicks the Next button
    Then the responder is navigated to the Verify page
    When the responder selects Yes
    And the responder clicks the Next button
    Then the responder is navigated to the Respondent page
    When the responder enters a generated first name
    And the responder enters a generated middle name
    And the responder enters a generated last name
    And the responder enters a generated telephone number
    And the responder enters a generated email address
    And the responder clicks the Next button
    Then the responder is navigated to the Popcount page
    When the responder enters "1" as the number of people
    And the responder clicks the Who should I include link
    Then the Help modal popup is displayed
    And the responder validates the Help text "POPCOUNT_Help_Text" in "EN"
    When the responder clicks the Close button on the Help modal popup
    Then the Help modal popup is closed
    And the responder is navigated back to the Popcount page
