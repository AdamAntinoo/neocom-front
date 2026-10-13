Feature: App info panel
  The start page shows the application name, version, and copyright.

  Scenario: App info panel shows three fields with their contents and fonts
    When I open the dashboard
    Then the app info panel has 3 fields
    And the app info field "app-name" shows "NEOCOM-FRONT" in the "Elemental" font
    And the app info field "app-version" shows "0.0.0" in the "Elemental" font
    And the app info field "app-copyright" shows "© 2019,2024 Dimensinfin Industries" in the "Open Sans" font
