Feature: Application shell
  As a NEOCOM developer
  I want the Angular app to load
  So that local development and acceptance tests can start

  Scenario: Unauthenticated home redirects to the login page
    When I open the application home page without a session
    Then the login page is visible

  Scenario: Authenticated home shows the dashboard shell
    Given I have a completed login session
    When I open the application home page
    Then the application shell is visible
