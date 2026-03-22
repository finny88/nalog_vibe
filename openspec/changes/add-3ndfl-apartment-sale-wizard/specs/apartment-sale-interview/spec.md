## ADDED Requirements

### Requirement: Supported apartment-sale cases MUST be constrained at wizard entry
The system SHALL only proceed with the apartment-sale interview when the user confirms a 2025 filing year, resident taxpayer status, and the supported single-apartment, single-owner, no-shares case.

#### Scenario: Supported case continues
- **WHEN** the user confirms that the declaration is for 2025, the taxpayer is a resident, and the sale concerns one apartment with one owner and no shares
- **THEN** the system proceeds into the wizard flow

#### Scenario: Unsupported case is blocked early
- **WHEN** the user indicates a different tax year, non-resident status, multiple objects, shares, or a non-apartment case
- **THEN** the system SHALL stop the supported wizard flow and indicate that the case is not supported in this version

### Requirement: The wizard MUST collect the canonical apartment-sale inputs
The system SHALL collect the taxpayer, apartment, acquisition, sale, and cadastral-value inputs required for the supported case through a multi-step wizard.

#### Scenario: User completes the required steps
- **WHEN** the user advances through the wizard steps for taxpayer data, apartment data, acquisition data, sale data, and cadastral value
- **THEN** the system stores those values in the canonical case model for the supported 2025 apartment-sale case

#### Scenario: Required data is missing on a step
- **WHEN** the user attempts to continue without completing a required value for the current step
- **THEN** the system SHALL keep the user on that step and identify the missing input

### Requirement: Wizard questions MUST guide low-knowledge users
Each important wizard input SHALL provide plain-language help, where-to-find guidance, example content, and validation feedback suitable for a user without tax expertise.

#### Scenario: User needs help locating a value
- **WHEN** the user views a field such as acquisition date, sale amount, or cadastral number
- **THEN** the system shows where that value can be found in typical source documents

#### Scenario: User enters an invalid value
- **WHEN** the user enters a malformed or impossible value for a guided field
- **THEN** the system shows validation feedback in plain language and requests a corrected value

### Requirement: The wizard MUST explain the tax outcome as it becomes known
The system SHALL present step summaries and a final plain-language outcome that explain whether filing is required and which reduction method applies to the supported case.

#### Scenario: Filing relief applies
- **WHEN** the rules layer determines that the supported case qualifies for ownership-term relief
- **THEN** the system explains that result in plain language before final export

#### Scenario: Taxable case requires reduction choice
- **WHEN** the rules layer determines that the supported case remains taxable
- **THEN** the system explains the available reduction methods and allows the user to confirm the method used for export
