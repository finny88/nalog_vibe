## Context

The first product slice is a web application that helps a resident taxpayer prepare a 2025 3-NDFL declaration for one apartment sale through a wizard instead of a tax-form editor. The supported case remains intentionally narrow: one apartment, one owner, no shares, resident taxpayer only, and acquisition by purchase only.

Since the repository is still at bootstrap stage, the change must define not only the supported product behavior but also the technical foundation for implementing it. The project will use a Yarn 4 monorepo with separate web and API applications, plus shared packages for domain and tooling concerns. The user-facing experience must remain usable on desktop, laptop, tablet, and mobile devices as part of the MVP.

The change must also produce filing-ready XML for the 2025 declaration format. That creates a structural constraint: the system cannot use the FNS XML shape as its primary domain model, because the same interview and rules will later need to support more declaration branches and future tax-year formats.

The frontend bootstrap should reuse the existing project conventions and configuration style already captured in the following reference files from the related codebase under `C:\projects\saas_mvp\apps\frontend`:
- `GPT.md`
- `.prettierrc.json`
- `eslint.config.js`
- `postcss.config.cjs`
- `tsconfig.app.json`
- `tsconfig.json`
- `tsconfig.node.json`

These files are a baseline for web-layer conventions and should inform the new monorepo setup rather than being reinterpreted from scratch.

## Goals / Non-Goals

**Goals:**
- Bootstrap the repository as a Yarn 4 monorepo with `apps/web`, `apps/api`, and shared packages for domain and configuration.
- Build a wizard-based interview for the supported apartment-sale case.
- Maintain a canonical tax-case model that is independent from the FNS XML schema and separate from persistence models.
- Evaluate the supported rules needed for the case: filing requirement, ownership-term relief, and tax-base reduction method.
- Support both reduction paths for the supported case: documented purchase expenses and fixed property deduction.
- Persist the client-side wizard draft across page reloads.
- Provide a responsive wizard experience for desktop, laptop, tablet, and mobile.
- Map the completed case into a filing-ready 2025 XML export.
- Establish a test strategy with domain-level unit tests and Playwright-based end-to-end coverage.

**Non-Goals:**
- Supporting non-residents, multiple objects, shares, houses, land plots, or non-purchase acquisition methods.
- Supporting OCR, document upload as a source of truth, or automatic extraction from files.
- Supporting other 3-NDFL branches beyond the single apartment-sale case.
- Designing the system around a chat UI.
- Solving multi-year declaration support in this first slice beyond keeping year-specific logic isolated.
- Building a full backend draft-sync system in the first iteration.

## Decisions

### Decision: Bootstrap as a monorepo with separate web and API applications
The repository SHALL be structured as a Yarn 4 workspace monorepo with `apps/web`, `apps/api`, and shared packages for domain and tooling concerns.

Rationale:
- The product already has clear frontend and backend responsibilities.
- Shared packages allow reuse of domain contracts without forcing frontend and backend code into one application.
- A monorepo keeps tooling, dependency management, and local development aligned.

Alternatives considered:
- Separate repositories: rejected because the initial product slice is tightly coupled across frontend, backend, and shared domain contracts.
- A single application package: rejected because it would blur web and API boundaries early.

### Decision: Use a wizard, not a chat interface
The product SHALL use a multi-step wizard with progress, route-per-step navigation, and per-step summaries.

Rationale:
- The target user needs structure, not conversational ambiguity.
- A wizard is easier to validate, test, and reason about for a regulated workflow.
- Route-per-step navigation supports browser history, deep links, step guards, and draft restoration.

Alternatives considered:
- Chat-like flow: rejected for v1 because it adds UI and state-management complexity without improving the core filing logic.
- Single-route wizard state: rejected because route-per-step better supports recovery and navigation.

### Decision: Use React Context plus a reducer for the wizard draft
The web application SHALL hold the cross-step wizard draft in a dedicated React Context backed by a reducer and persist the user-entered source data in local storage.

Rationale:
- The draft is flow-local state, not application-wide global state.
- Step-level patch updates align naturally with route-per-step forms.
- Persisting only user-entered source data avoids stale derived values and simplifies schema migration.

Alternatives considered:
- Redux plus RTK Query: rejected for v1 because it adds a broader global-store abstraction than the wizard currently needs.
- Multiple `useState` hooks: rejected because a reducer gives cleaner, testable transitions for hydrate, reset, and step updates.
- Persisting derived tax results: rejected because those values should be recomputed from authoritative inputs.

### Decision: Separate business logic from persistence
The system SHALL keep tax rules and the canonical apartment-sale model separate from persistence and ORM concerns.

Rationale:
- Tax rules are the core value of the product and must remain reusable and testable.
- Persistence shape and database tables can evolve independently from business rules.
- XML generation and declaration mapping should consume canonical domain data, not Prisma models.

Alternatives considered:
- Embedding business logic in ORM models or persistence services: rejected because it couples domain behavior to storage details.

### Decision: Use a layered backend with Fastify, Prisma, and PostgreSQL
The API SHALL use Fastify for transport, Prisma for persistence, and PostgreSQL for the relational store, while keeping application orchestration and domain logic above persistence.

Rationale:
- Fastify fits a structured TypeScript API well.
- PostgreSQL is a better fit than a document database for highly structured declaration and workflow data.
- Prisma provides migration support and strong DX without becoming the domain model.

Alternatives considered:
- Express: not selected because Fastify provides a cleaner baseline for a new TypeScript service.
- MongoDB: rejected because the supported tax case is structured and relational by nature.

### Decision: Keep field help as first-class question metadata
Each wizard question SHALL include label, help text, where-to-find guidance, example content, and validation metadata.

Rationale:
- The product value depends on guiding a low-knowledge user, not just collecting inputs.
- This metadata can drive consistent rendering and validation across steps.
- It creates a reusable question catalog rather than hard-coded field descriptions.

Alternatives considered:
- Writing help text ad hoc in components: rejected because it leads to duplication and inconsistency.

### Decision: Use lightweight functional iconography in the web bootstrap
The web application SHALL use `@tabler/icons-react` for functional interface icons and replace the default Vite favicon with a custom tax-themed favicon during web bootstrap.

Rationale:
- The product needs clear, utilitarian iconography for wizard steps, statuses, and helper UI without introducing a custom icon system too early.
- Replacing the default Vite favicon avoids shipping placeholder branding into the MVP.
- A small functional icon set is enough for the supported case and fits the MVP scope.

Alternatives considered:
- Building a custom icon set up front: rejected because it adds design and asset work without clear MVP value.
- Keeping the default Vite favicon: rejected because it makes the product feel unfinished.
### Decision: Require responsive wizard UX in the MVP
The web application SHALL treat responsive behavior as a first-class requirement and design the wizard shell, forms, summaries, and review screens for desktop, laptop, tablet, and mobile.

Rationale:
- The target audience may use multiple device types.
- Wizard UX becomes frustrating quickly if the mobile layout is treated as a later polish task.
- A responsive baseline is cheaper to design early than to retrofit later.

Alternatives considered:
- Desktop-first MVP with later responsive work: rejected because it would create avoidable rework and poor early UX.

### Decision: Use a split test strategy
The project SHALL use unit and integration tests for pure domain and application logic, plus Playwright end-to-end tests for critical wizard flows.

Rationale:
- Domain logic such as relief checks, reduction method handling, and mapping is faster and clearer to verify with unit tests.
- Wizard navigation, draft persistence, and end-to-end filing flows are best verified with browser automation.
- This keeps e2e coverage focused on the highest-value scenarios without overloading it with every logic case.

Alternatives considered:
- E2E-only testing: rejected because it makes domain edge cases slower and harder to diagnose.
- Heavy UI unit-test coverage: rejected because the wizard value is better captured through domain tests plus a smaller set of critical browser flows.

### Decision: Enforce pre-commit quality gates in the monorepo
The repository SHALL use Husky and lint-staged so staged files are processed with Prettier first and ESLint second, followed by TypeScript checks for the relevant changed workspaces before a commit is accepted.

Rationale:
- The project depends heavily on TypeScript and architectural linting rules on both the web and API sides.
- Running Prettier before ESLint keeps staged formatting deterministic and reduces avoidable lint noise.
- TypeScript checks are still required, but they should run at the workspace level rather than pretending to operate on single staged files.
- A monorepo benefits from one shared commit-quality baseline rather than separate ad hoc checks per app.

Alternatives considered:
- Relying only on CI: rejected because the user explicitly wants commit-time hygiene.
- Lint-only hooks: rejected because type regressions are also important for this project.

### Decision: Treat XML as the primary output and PDF as deferred
The first implementation SHALL focus on filing-ready XML for the 2025 format. Any PDF output is out of scope for this change.

Rationale:
- XML is the filing-critical artifact.
- Limiting output scope keeps the first slice aligned with the MVP goal.
- PDF can be added later as a rendering concern without changing the core case model.

Alternatives considered:
- Building XML and PDF together: rejected because PDF is secondary for the current use case.

## Risks / Trade-offs

- [Year-specific filing rules leak into shared domain code] -> Keep 2025 declaration mapping and format-specific logic in dedicated year-scoped modules.
- [The supported case quietly expands during implementation] -> Enforce explicit scope checks in the wizard and specs, and reject unsupported cases early.
- [Users still do not understand required inputs] -> Require question-level guidance, examples, and per-step summaries as part of the capability.
- [Client draft persistence becomes stale or corrupted] -> Version persisted drafts and validate them before hydration.
- [XML generation drives architecture prematurely] -> Preserve the canonical model to keep export as a downstream mapping step.
- [Reference data such as IFNS or OKTMO becomes a blocker] -> Allow the architecture to include a dedicated reference-data module and keep unresolved sourcing questions visible in implementation planning.
- [Too much logic drifts into frontend code] -> Keep the backend as the authoritative source for tax decisions and export output.

## Migration Plan

- Bootstrap the monorepo structure, shared configs, and Docker-based PostgreSQL first.
- Introduce the web wizard shell, API service, shared domain package, and persistence wiring as new code because the repository is currently at project bootstrap stage.
- Use local storage for first-iteration draft persistence; defer server-side draft sync to a later change.
- Rollback is straightforward: revert the change before release if the supported-case implementation proves incorrect.

## Open Questions

- What exact source will be used in implementation for deriving IFNS and OKTMO from the taxpayer address?
- Will the XML export be validated against official XSD during generation time, test time, or both?
- Should the first version show a detailed tax calculation breakdown or only a user-friendly summary plus final result?
- At what point should `question-catalog`, `declaration-2025`, and `xml-export` move from app-local modules into separate workspace packages?








