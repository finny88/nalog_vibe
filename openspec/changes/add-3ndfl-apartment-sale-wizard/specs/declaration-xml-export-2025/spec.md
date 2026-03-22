## ADDED Requirements

### Requirement: The API MUST treat backend evaluation as authoritative for export
The system SHALL evaluate the supported apartment-sale case on the backend as the authoritative source for tax outcome and export decisions.

#### Scenario: Client submits supported case data for assessment
- **WHEN** the web application submits a supported apartment-sale draft for evaluation
- **THEN** the backend computes the authoritative filing and reduction outcome for export-related decisions

### Requirement: The system MUST map the supported case into a 2025 declaration structure
The system SHALL transform the completed canonical apartment-sale case into a declaration representation aligned with the 2025 3-NDFL filing format.

#### Scenario: Completed supported case is prepared for export
- **WHEN** the backend receives all required data for the supported apartment-sale case
- **THEN** the system produces a declaration representation containing the values required for 2025 XML export

### Requirement: The system MUST export filing-ready XML for the supported case
The system SHALL generate an XML document for the supported apartment-sale case that is intended for submission through taxpayer filing channels for the 2025 tax year.

#### Scenario: Export succeeds for a complete supported case
- **WHEN** the completed supported case contains all required export data
- **THEN** the system generates a 2025 XML file for that declaration

#### Scenario: Export is blocked when required data is missing
- **WHEN** required export data for the supported case is incomplete or unresolved
- **THEN** the system SHALL refuse XML generation and identify the blocking data gaps

### Requirement: The system MUST keep export format concerns separate from interview state
The XML export capability SHALL consume a canonical case model rather than requiring the interview flow to store values directly in XML-shaped state.

#### Scenario: Interview data is finalized before export mapping
- **WHEN** the supported case is ready for export
- **THEN** the system maps the canonical case into export form as a downstream step rather than treating XML as the primary interaction model

### Requirement: The system MUST support rule-driven reduction outcomes in export
The exported declaration SHALL reflect the supported tax outcome for the case, including ownership-term relief or the selected reduction method for a taxable sale.

#### Scenario: Ownership-term relief result is exported
- **WHEN** the rules layer determines that the sale qualifies for relief under the supported case
- **THEN** the generated declaration reflects that outcome consistently in the export data

#### Scenario: Selected reduction method is exported
- **WHEN** the user finalizes a taxable supported case with either documented purchase expenses or the fixed property deduction
- **THEN** the generated declaration reflects the selected reduction method in the export data
