Feature: Application shell
  As a NEOCOM developer
  I want the Angular app to load
  So that local development and acceptance tests can start

  Scenario: Home page is reachable
    When I open the application home page
    Then the application shell is visible
