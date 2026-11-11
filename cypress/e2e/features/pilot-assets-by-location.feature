Feature: Pilot assets by location page
  As an authenticated pilot
  I want the assets-by-location page
  So that I can review assets grouped by location

  Background:
    Given I have a completed login session

  Scenario: Assets by location page structure
    When I open the "pilot-assets-by-location" page
    Then the "assets-by-location" page is visible
    And the section named "app-page" is visible
    And the section named "breadcrumb" is visible
