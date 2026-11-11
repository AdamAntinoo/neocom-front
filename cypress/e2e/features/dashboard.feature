Feature: Dashboard home page
  As an authenticated pilot
  I want the dashboard shell with header, pilot panel, breadcrumb, and features
  So that I can navigate NeoCom pages

  Background:
    Given I have a completed login session

  Scenario: Authenticated home shows the dashboard shell
    When I open the application home page
    Then the application shell is visible
    And the section named "breadcrumb" is visible
    And the section named "feature-list" is visible
    And the section named "app-info" is visible
    And the section named "server-info" is visible

  Scenario: Dashboard route shows the same shell
    When I open the "dashboard" page
    Then the "dashboard-home" page is visible
    And the section named "v1-pilot" is visible
    And the section named "feature-list" is visible
