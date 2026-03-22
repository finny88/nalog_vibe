## Context

The first product slice is a web application that helps a resident taxpayer prepare a 2025 3-NDFL declaration for one apartment sale through a wizard instead of a tax-form editor. The supported case is intentionally narrow: one apartment, one owner, no shares, and acquisition by purchase only. The product is aimed at a user with little or no tax knowledge, so the interface must translate tax concepts into plain language and explain where each input value comes from.

The change must also produce filing-ready XML for the 2025 declaration format. That creates a structural constraint: the system cannot use the FNS XML shape as its primary domain model, because the same interview and rules will later need to support more declaration branches and future tax-year formats.

## Goals / Non-Goals

**Goals:**
- Build a wizard-based interview for the supported apartment-sale case.
- Maintain a canonical tax-case model that is independent from the FNS XML schema.
- Evaluate the supported rules needed for the case: filing requirement, ownership-term relief, and tax-base reduction method.
- Support both reduction paths for the supported case: documented purchase expenses and fixed property deduction.
- Map the completed case into a filing-ready 2025 XML export.
- Include user-facing guidance on what each field means and where to find it in source documents.

**Non-Goals:**
- Supporting non-residents, multiple objects, shares, houses, land plots, or non-purchase acquisition methods.
- Supporting OCR, document upload as a source of truth, or automatic extraction from files.
- Supporting other 3-NDFL branches beyond the single apartment-sale case.
- Designing the system around a chat UI.
- Solving multi-year declaration support in this first slice beyond keeping year-specific logic isolated.

## Decisions

### Decision: Use a wizard, not a chat interface
The product SHALL use a multi-step wizard with progress and per-step summaries.

Rationale:
- The target user needs structure, not conversational ambiguity.
- A wizard is easier to validate, test, and reason about for a regulated workflow.
- The "interview" feel can still be delivered through step phrasing, help text, and summaries.

Alternatives considered:
- Chat-like flow: rejected for v1 because it adds UI and state-management complexity without improving the core filing logic.

### Decision: Use a canonical tax-case model as the core state
The system SHALL store the supported case in a domain model centered on taxpayer, apartment, acquisition, sale, cadastral value, and tax assessment rather than in XML-shaped objects.

Rationale:
- XML is a transport/export format, not the business domain.
- The same case model can later support other renderers, future tax years, and richer UX.
- It keeps interview, rule evaluation, and export concerns separate.

Alternatives considered:
- Writing directly into XML-bound structures: rejected because it couples UI and rules to one year-specific filing format.

### Decision: Isolate tax rules from interview content
The system SHALL evaluate filing requirement, ownership-term relief, and reduction-method options in a dedicated rules layer.

Rationale:
- The same rules need to be callable after each wizard step and again at finalization.
- UI help text and plain-language explanations should be changeable without changing rule logic.
- This separation makes later testing and expansion safer.

Alternatives considered:
- Embedding rules inside form components or step handlers: rejected because it would scatter regulated logic across the frontend flow.

### Decision: Keep field help as first-class question metadata
Each wizard question SHALL include label, help text, where-to-find guidance, example content, and validation metadata.

Rationale:
- The product value depends on guiding a low-knowledge user, not just collecting inputs.
- This metadata can drive consistent rendering and validation across steps.
- It creates a reusable question catalog rather than hard-coded field descriptions.

Alternatives considered:
- Writing help text ad hoc in components: rejected because it leads to duplication and inconsistency.

### Decision: Treat XML as the primary output and PDF as deferred
The first implementation SHALL focus on filing-ready XML for the 2025 format. Any PDF output is out of scope for this change.

Rationale:
- XML is the filing-critical artifact.
- Limiting output scope keeps the first slice aligned with the MVP goal.
- PDF can be added later as a rendering concern without changing the core case model.

Alternatives considered:
- Building XML and PDF together: rejected because PDF is secondary for the current use case.

## Risks / Trade-offs

- [Year-specific filing rules leak into shared domain code] > Keep 2025 declaration mapping and format-specific logic in dedicated year-scoped modules.
- [The supported case quietly expands during implementation] > Enforce explicit scope checks in the wizard and specs, and reject unsupported cases early.
- [Users still do not understand required inputs] > Require question-level guidance, examples, and per-step summaries as part of the capability.
- [XML generation drives architecture prematurely] > Preserve the canonical model to keep export as a downstream mapping step.
- [Reference data such as IFNS or OKTMO becomes a blocker] > Allow the architecture to include a dedicated reference-data module and keep unresolved sourcing questions visible in implementation planning.

## Migration Plan

- Introduce the wizard, domain model, rules layer, and XML export as a new capability set.
- No existing user flows or production migrations are expected because the repository is currently at project bootstrap stage.
- Rollback is straightforward: revert the change before release if the supported-case implementation proves incorrect.

## Open Questions

- What exact source will be used in implementation for deriving IFNS and OKTMO from the taxpayer address?
- Will the XML export be validated against official XSD during generation time, test time, or both?
- Should the first version show a detailed tax calculation breakdown or only a user-friendly summary plus final result?
