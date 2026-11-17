@home @regression
Feature: ISR HOME Screen Content Validation

  Scenario: ISR HOME Screen Tenure Selection and Help Text Validation
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
    And the responder clicks the Next button
    Then the responder is navigated to the Undercount page
    When the responder selects No
    And the responder clicks the Next button
    Then the responder is navigated to the Home page
    When the responder selects the "Rented?" option
    And the responder clicks the Help tooltip
    Then the Help modal popup is displayed
    And the responder validates the Help text "HOME_Help_Text" in "EN"
    When the responder clicks the Close button on the Help modal popup
    Then the Help modal popup is closed
    And the responder is navigated back to the Home page
