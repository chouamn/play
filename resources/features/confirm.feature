@confirm @regression
Feature: ISR Confirm Screen Content Validation

  Scenario: ISR Confirm Screen Help Text Validation
    # Log in (same steps as login.feature)
    Given the responder is on the Census login page
    When the responder enters the Census ID "CENSUS_ID_VALID_1"
    And the responder clicks the Login button
    Then the responder is navigated to the Confirm page

    # Help open/close steps are shared with verify_address.feature
    When the responder clicks the Help tooltip
    Then the Help modal popup is displayed
    # "CONFIRM_Help_Text" is the Excel row (Screen column); the expected text stays in Excel
    And the responder validates the Help text "CONFIRM_Help_Text" in "EN"

    When the responder clicks the Close button on the Help modal popup
    Then the Help modal popup is closed
    And the responder is navigated back to the Confirm page
