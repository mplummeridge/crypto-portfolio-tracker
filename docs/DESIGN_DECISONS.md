# Design Decisions Documentation

This document outlines the rationale behind some key architectural and technical choices made in the Crypto Portfolio Tracker project:

## 1. Framework: Next.js (App Router)

* **Choice:** Next.js with the App Router was chosen over vanilla React (CRA) or other frameworks.
* **Rationale:**
    * **API Routes:** Provides a straightforward way to create a Backend-for-Frontend (BFF) pattern (`/app/api/...`). This allows securely managing external API keys on the server-side instead of exposing them in the client bundle.
    * **File-based Routing:** Simplifies page creation and routing logic.
    * **React Server Components (RSC):** Although potentially overkill for this specific test, using the App Router allows leveraging RSCs for potentially improved performance by fetching initial data on the server.
    * **Built-in Optimizations:** Includes features like image optimization, code splitting, and prefetching.
* **Trade-offs:** Introduces more complexity than a simple Client-Side Rendered (CSR) React app. Might be considered over-engineering for the test's core requirements but demonstrates familiarity with modern full-stack React development.

## 2. State Management: Zustand

* **Choice:** Zustand was selected over Redux, MobX, or Context API.
* **Rationale:**
    * **Simplicity:** Offers a minimal API compared to Redux boilerplate, while being more structured than vanilla Context for state updates.
    * **Performance:** Generally considered performant, avoiding unnecessary re-renders with its selector model.
    * **Middleware:** Supports middleware like `persist` for easy integration with `localStorage`, fulfilling a core requirement.
* **Trade-offs:** Less widely adopted than Redux, potentially less familiar to some developers. Debugging tools might be less mature than Redux DevTools (though still good).

## 3. UI: Tailwind CSS + Shadcn UI

* **Choice:** Utility-first CSS (Tailwind) combined with a pre-built component library based on it (Shadcn UI).
* **Rationale:**
    * **Rapid Development:** Tailwind allows for quick styling directly in the markup.
    * **Consistency:** Shadcn UI provides well-designed, accessible components, ensuring a consistent look and feel.
    * **Customization:** Both are highly customizable. Shadcn components are copied into the project, allowing full control.
    * **Dark Mode:** Easily supported via Tailwind's `dark:` variant and CSS variables defined in `globals.css`.
* **Trade-offs:** Can lead to verbose class names in JSX. Requires familiarity with Tailwind's utility classes.

## 4. Testing: Playwright (E2E) + Axe (Accessibility) + Jest (Unit/Integration)

* **Choice:** A multi-layered testing strategy was implemented.
* **Rationale:**
    * **Playwright:** Provides robust end-to-end testing, simulating real user interactions across different browsers (`playwright.config.ts`). Ensures key user flows work as expected (`tests/holding-management.spec.ts`).
    * **Axe:** Integrated with Playwright (`e2e/accessibility.spec.ts`) to automatically catch basic accessibility violations, promoting inclusive design.
    * **Jest:** Configured (`jest.setup.js`) for unit and integration tests, suitable for testing individual functions (utils, state logic) and component interactions in isolation.
* **Trade-offs:** Setting up and maintaining E2E tests can be time-consuming. Test coverage needs to be sufficient to catch critical bugs.

## 5. Persistence: Zustand `persist` Middleware

* **Choice:** Using the built-in `persist` middleware from Zustand.
* **Rationale:** Directly fulfills the requirement to use `localStorage` for portfolio data with minimal configuration (`lib/store.ts`). Handles serialization automatically.
* **Trade-offs:** `localStorage` has size limits (around 5MB) and is synchronous, though unlikely to be an issue for this specific application's data size. IndexedDB (also allowed by the spec) would be more robust for larger/complex client-side storage but adds more implementation overhead.