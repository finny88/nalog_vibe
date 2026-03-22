## 1. Foundation

- [ ] 1.1 Inspect the current project bootstrap and create the initial module structure for interview, domain, rules, declaration-2025, xml-export, and reference-data.
- [ ] 1.2 Define the canonical apartment-sale case model for the supported 2025 scenario.
- [ ] 1.3 Define the wizard question catalog contract, including help text, where-to-find guidance, examples, and validation metadata.

## 2. Wizard Flow

- [ ] 2.1 Implement the entry step that enforces the supported case constraints for year, residency, and single-apartment scope.
- [ ] 2.2 Implement the taxpayer, apartment, acquisition, sale, and cadastral-value wizard steps.
- [ ] 2.3 Implement per-step summaries and plain-language validation feedback for low-knowledge users.

## 3. Tax Rules

- [ ] 3.1 Implement rule evaluation for filing requirement and ownership-term relief for the supported apartment-sale case.
- [ ] 3.2 Implement reduction-method handling for documented purchase expenses and fixed property deduction.
- [ ] 3.3 Implement the final tax-outcome summary that explains whether filing relief applies or which reduction method is used.

## 4. Declaration Export

- [ ] 4.1 Implement mapping from the canonical case model into a 2025 declaration export representation.
- [ ] 4.2 Implement XML generation for the supported 2025 apartment-sale case.
- [ ] 4.3 Implement export-time checks that block XML generation when required data is incomplete.

## 5. Verification

- [ ] 5.1 Add tests for supported-case gating, required wizard inputs, and guided validation behavior.
- [ ] 5.2 Add tests for ownership-term relief, reduction-method selection, and final tax outcome summaries.
- [ ] 5.3 Add tests for 2025 XML export mapping and generation for the supported case.
