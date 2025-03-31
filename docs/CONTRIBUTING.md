# Contributing Guidelines

Thank you for considering contributing to the Crypto Portfolio Tracker! Please follow these guidelines to ensure a smooth process.

## Getting Started

1.  Ensure you have read the main `README.md` for project setup and installation instructions.
2.  Create a fork of the repository.
3.  Create a new branch for your feature or bugfix (e.g., `feat/add-new-chart` or `fix/holding-form-validation`).

## Coding Standards & Conventions

- **Language:** TypeScript. Follow standard TypeScript best practices.
- **Framework:** Adhere to Next.js (App Router) and React best practices. See `docs/ARCHITECTURE.md`.
- **Styling:** Use Tailwind CSS utility classes primarily. Follow guidelines in `docs/STYLING.md`.
- **Linting & Formatting:** The project uses [Biome](https://biomejs.dev/).
  - Run `npm lint` to check for linting issues.
  - Run `npm format` to format code before committing.
  - Consider installing the Biome IDE extension for real-time feedback.
- **Cursor Rules:** If using Cursor IDE, refer to the `.cursor/rules/` directory for additional context and best practices defined for this project (Clean Code, React, Next.js, TypeScript, Tailwind).
- **Naming Conventions:**
  - Components: `PascalCase` (`MyComponent.tsx`)
  - Files (non-components): `kebab-case` (`api-clients.ts`) or `camelCase` (`useCryptoData.ts`) - follow existing patterns.
  - Variables/Functions: `camelCase`
  - Types/Interfaces: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`

## Branching Strategy

(Optional - Define your preferred branching strategy here, e.g., Gitflow)
*Example:*
- `main`: Production-ready code.
- `develop`: Integration branch for features.
- Feature branches: `feat/...`
- Bugfix branches: `fix/...`
- Hotfix branches: `hotfix/...`

## Commit Messages

Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps automate changelog generation and makes commit history easier to understand.

*Example:*
`feat: add portfolio distribution pie chart`
`fix: correct calculation for total portfolio value`
`refactor(HoldingsList): break down component into smaller parts`
`docs: update data fetching documentation`
`test: add unit tests for date formatting utility`

## Testing

- **Expectation:** Contributions should ideally include relevant tests for new features or bug fixes.
- **Unit Tests:** Located alongside the code they test (e.g., `lib/utils.test.ts`) or potentially in `tests/unit/`. Use Jest/React Testing Library. Run with `npm test:unit` (verify script). Focus on testing utility functions and potentially isolated component logic.
- **Integration/Component Tests:** Likely located in `tests/`. Use Jest/React Testing Library. Focus on testing component interactions, props, and rendering logic.
- **End-to-End (E2E) Tests:** Located in `e2e/`. Uses Playwright. Run with `pnpm test:e2e` (verify script). Focus on testing critical user flows through the application UI.
- **Review Existing Tests:** Before adding new tests, review the existing suites in `tests/` and `e2e/`.
- **Updating Tests:** Ensure tests are updated if refactoring changes existing functionality.

## Pull Request Process

1.  Ensure your code lints (`npm lint`) and formats (`npm format`) correctly.
2.  Ensure relevant tests pass (`npm test:unit`, `npm test:e2e`).
3.  Push your branch to your fork.
4.  Create a Pull Request (PR) from your fork's branch to the main repository's `develop` (or `main`) branch.
5.  Provide a clear title and description for your PR, explaining the changes and referencing any related issues.
6.  Be prepared to address feedback and make changes during the code review process.

Thank you for contributing!