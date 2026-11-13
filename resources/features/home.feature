@home @regression
Feature: ISR Login Screen Content Validation

  Scenario: ISR Login with a valid Census ID
    # Opens BASE_URL from resources/environment/.env.uat
    Given the responder is on the Census home page
    # "CENSUS_ID_VALID_1" is the NAME of the setting in .env.uat; the real ID stays hidden there
    When the responder enters the Census ID "CENSUS_ID_VALID_1"
    And the responder clicks the Login button
    # Passes when the CONFIRM page heading is visible
    Then the responder is navigated to the Confirm page
