## 1. Monorepo Bootstrap

- [x] 1.1 Initialize the Yarn 4 workspace monorepo with root package management, workspace configuration, shared formatting, and task orchestration.
- [x] 1.2 Create the day-one workspace layout with `apps/web`, `apps/api`, `packages/tax-domain`, `packages/tsconfig`, and `packages/eslint-config`.
- [x] 1.3 Add shared TypeScript and ESLint foundations so web, api, and workspace packages can build and lint consistently.
- [x] 1.4 Configure Husky and lint-staged so staged files run `prettier` and `eslint` before commit, then run workspace-aware TypeScript checks for affected web and api code.

## 2. Local Infrastructure

- [x] 2.1 Add Docker Compose configuration for PostgreSQL as the default local database dependency.
- [x] 2.2 Configure Prisma and the API environment baseline for local database access.
- [x] 2.3 Add root scripts for local development, build, lint, typecheck, and test workflows across the monorepo.
- [x] 2.4 Add workspace-aware lint and typecheck commands that can be reused by pre-commit hooks.

## 3. Shared Domain Foundation

- [ ] 3.1 Define the canonical apartment-sale case model for the supported 2025 scenario in `packages/tax-domain`.
- [ ] 3.2 Define validation schemas for persisted wizard draft input and backend-facing supported-case input.
- [ ] 3.3 Define the wizard question catalog contract, including help text, where-to-find guidance, examples, and validation metadata.

## 4. Web Application Bootstrap

- [ ] 4.1 Bootstrap `apps/web` with Vite, React, Mantine, React Router, React Hook Form, Zod, Axios, TanStack Query, CSS Modules, `@tabler/icons-react`, a custom tax-themed favicon, and the agreed frontend tooling.
- [ ] 4.2 Implement the responsive wizard shell, route-per-step navigation, and guarded step routing.
- [ ] 4.3 Implement the wizard draft provider using React Context, a reducer, and localStorage persistence for user-entered source data only.

## 5. API Bootstrap

- [ ] 5.1 Bootstrap `apps/api` with Fastify, environment loading, and a health-check baseline.
- [ ] 5.2 Implement the layered API structure so transport, application orchestration, domain logic, and persistence remain separated.
- [ ] 5.3 Wire the API to consume canonical domain input and prepare for authoritative tax assessment and export flows.

## 6. Supported Wizard Flow

- [ ] 6.1 Implement the entry step that enforces the supported case constraints for year, residency, and single-apartment scope.
- [ ] 6.2 Implement the taxpayer, apartment, acquisition, sale, and cadastral-value wizard steps.
- [ ] 6.3 Implement per-step summaries and plain-language validation feedback for low-knowledge users.

## 7. Tax Rules and Export

- [ ] 7.1 Implement backend rule evaluation for filing requirement and ownership-term relief for the supported apartment-sale case.
- [ ] 7.2 Implement backend reduction-method handling for documented purchase expenses and fixed property deduction.
- [ ] 7.3 Implement mapping from the canonical case model into a 2025 declaration export representation and filing-ready XML generation.
- [ ] 7.4 Implement export-time checks that block XML generation when required data is incomplete.

## 8. Verification

- [ ] 8.1 Add unit or integration tests for canonical domain validation, draft persistence behavior, and supported-case rule evaluation.
- [ ] 8.2 Add frontend tests for guarded navigation, required wizard inputs, and guided validation behavior.
- [ ] 8.3 Add Playwright end-to-end tests for the critical supported wizard path, reload recovery, and final export flow.





