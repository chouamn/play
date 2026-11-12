@confirm @regression
Feature: ISR Confirm Screen Content Validation

  Scenario: ISR Confirm Screen Help Text Validation
    # Log in (same steps as home.feature)
    Given the responder is on the Census home page
    When the responder enters a valid 12-digit Census ID
    And the responder clicks the Login button
    Then the responder is navigated to the Confirm page

    # Help open/close steps are shared with verify_address.feature
    When the responder clicks the Help tooltip
    Then the Help modal popup is displayed
    # Compares the Help text and bold with the CONFIRM_Help_Text row in Excel
    And the responder validates the Confirm Help text against the expected content

    When the responder clicks the Close button on the Help modal popup
    Then the Help modal popup is closed
    And the responder is navigated back to the Confirm page
