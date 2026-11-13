@verify @regression
Feature: ISR Verify Screen Content Validation

  Scenario: ISR Verify Screen Help Text Validation
    # Log in (same steps as home.feature)
    Given the responder is on the Census home page
    When the responder enters the Census ID "CENSUS_ID_VALID_1"
    And the responder clicks the Login button
    Then the responder is navigated to the Confirm page

    # Yes and Next are on the CONFIRM screen
    When the responder selects Yes
    And the responder clicks the Next button
    # Passes when the VERIFY ADDRESS heading is visible
    Then the responder is navigated to the Verify page

    # Help open/close steps are shared with confirm.feature
    When the responder clicks the Help tooltip
    Then the Help modal popup is displayed
    # "VERIFY_ADDRESS_Help_Text" is the Excel row (Screen column); the expected text stays in Excel
    And the responder validates the Help text "VERIFY_ADDRESS_Help_Text" in "EN"

    When the responder clicks the Close button on the Help modal popup
    Then the Help modal popup is closed
    And the responder is navigated back to the Verify page
