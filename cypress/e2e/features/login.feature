Feature: Login page
  As a pilot without a session
  I want the login page to present NeoCom branding and the EVE SSO entry
  So that I can start authentication

  # model-strip and color-table are intentionally excluded from acceptance
  Scenario: Unauthenticated home redirects to the login page
    When I open the application home page without a session
    Then the login page is visible

  Scenario: Login page shows the EVE SSO button and app info
    When I open the login page
    Then the login page is visible
    And the button named "EVE-login-button" is visible
    And the app info panel has 3 fields
    And the app info field "app-name" shows "NEOCOM-FRONT" in the "Elemental" font
    And the app info field "app-version" shows "0.1.0" in the "Elemental" font
    And the app info field "app-copyright" shows "© 2019,2024 Dimensinfin Industries" in the "Open Sans" font
