Feature: Character selection page
  As an authenticated pilot
  I want to see stored characters and pick one
  So that I continue to the dashboard with the chosen pilot

  Background:
    Given I have a completed login session

  Scenario: Character selection lists the active pilot and header
    When I open the "character-selection" page
    Then the "character-selection" page is visible
    And the section named "app-page" is visible
    And the section named "app-info" is visible
    And the section named "v1-pilot" is visible

  Scenario: App name opens character selection from the dashboard
    When I open the "dashboard" page
    And I click the app name
    Then the "character-selection" page is visible
