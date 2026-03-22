## Why

Preparing a 3-NDFL declaration for an apartment sale is difficult for users who do not understand tax terminology, filing rules, or the structure of the declaration itself. We need a narrow first version that turns one common apartment-sale case into a guided wizard and produces a filing-ready XML for the 2025 tax year.

## What Changes

- Add a guided web wizard for preparing a 2025 3-NDFL declaration for a single apartment sale.
- Limit the first version to a resident taxpayer selling one apartment with one owner and no shares.
- Support only the case where the apartment was previously acquired by purchase.
- Collect data through manual input with field-level help, examples, and "where to find this" guidance.
- Determine whether filing is required, whether ownership-term relief applies, and which tax-base reduction method is available.
- Support both reduction paths for the supported case:
  - documented purchase expenses
  - fixed property deduction
- Generate filing-ready XML for the 2025 declaration format.

## Capabilities

### New Capabilities
- `apartment-sale-interview`: Guided wizard for a resident taxpayer filing 3-NDFL for one apartment sale in the 2025 tax year.
- `declaration-xml-export-2025`: Mapping and exporting the supported apartment-sale case into a filing-ready 2025 3-NDFL XML document.

### Modified Capabilities
- None.

## Impact

- Introduces a wizard-based web application flow for the supported tax case.
- Requires a canonical tax-case model separate from the FNS XML format.
- Requires tax rule evaluation for ownership-term relief, filing requirement, and reduction method selection.
- Requires mapping and validation against the 2025 declaration export format.
- Likely affects frontend flow definitions, domain/rules modules, reference-data handling, and XML export infrastructure.
