Feature: Industry blueprints by location page
  As an authenticated pilot
  I want the blueprints-by-location page
  So that I can review blueprint availability by location

  Background:
    Given I have a completed login session

  Scenario: Page chrome panels are present with expected contents
    When I open the "industry-blueprints-by-location" page
    Then the "blueprint-by-location" page is visible
    And the section named "app-page" is visible
    And the section named "app-info" is visible
    And the section named "server-info" is visible
    And the section named "v1-pilot" is visible
    And the section named "breadcrumb" is visible
    And the section named "blueprint-by-location" is visible
    And the app info field "app-name" shows "NEOCOM-FRONT" in the "Elemental" font
    And the app info field "app-version" shows "0.1.0" in the "Elemental" font
    And the target section is "v1-pilot"
    And the target field "pilotName" has value "Perico Tuerto"
    And the target field "pilotIdentifier" has value "93813310"
    And the breadcrumb shows "Dashboard"
    And the breadcrumb shows "Blueprint Availability"
    And the target section is "server-info"
    And the target field "server-name" has value "Tranquility"

  Scenario: Expanding the first region, system, and blueprint shows matching fields
    When I open the "industry-blueprints-by-location" page
    Then the "blueprint-by-location" page is visible
    And the hierarchy shows a field "regionName" with value "Domain"
    And the hierarchy row with field "regionName" equal to "Domain" has label "regionName" equal to "REGION"
    And the hierarchy row with field "regionName" equal to "Domain" has field "systemCount" equal to "1"
    When I expand the hierarchy row that has field "regionName" equal to "Domain"
    Then the hierarchy row with field "regionName" equal to "Domain" is expanded
    And the hierarchy shows a field "systemName" with value "Amarr"
    And the hierarchy row with field "systemName" equal to "Amarr" has label "systemName" equal to "SYSTEM"
    And the hierarchy row with field "systemName" equal to "Amarr" has field "blueprintCount" equal to "1"
    When I expand the hierarchy row that has field "systemName" equal to "Amarr"
    Then the hierarchy row with field "systemName" equal to "Amarr" is expanded
    And the hierarchy shows a field "blueprint-name" with value "Small EM Shield Reinforcer I Blueprint"
    And the hierarchy row with field "blueprint-name" equal to "Small EM Shield Reinforcer I Blueprint" has label "blueprint-name" equal to "BLUEPRINT NAME"
    And the hierarchy row with field "blueprint-name" equal to "Small EM Shield Reinforcer I Blueprint" has field "efficiency" equal to "10/20"
    And the hierarchy row with field "blueprint-name" equal to "Small EM Shield Reinforcer I Blueprint" has field "runs" equal to "300/300"
