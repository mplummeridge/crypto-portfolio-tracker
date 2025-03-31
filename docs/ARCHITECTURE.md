# Architecture Overview

This document provides a high-level overview of the Crypto Portfolio Tracker application's architecture.

## Core Technology

- **Framework:** Next.js
- **Language:** TypeScript
- **UI:** React, shadcn/ui component library, Tailwind CSS
- **State Management:** Zustand (Client-side global state), TanStack Query (Server state caching)
- **Charting:** Recharts
- **Animation:** Framer Motion

## Next.js App Router

The application leverages the Next.js App Router for file-system based routing and component organization. Key concepts used include:

- **Server Components:** Used by default for pages and layouts (`app/page.tsx`, `app/details/[id]/page.tsx`, `app/layout.tsx`). Responsible for fetching initial data required for the route server-side.
- **Client Components:** Components requiring interactivity, hooks (`useState`, `useEffect`), or browser APIs are marked with the `"use client"` directive (e.g., most components in `app/dashboard/_components/`, `components/holding-form.tsx`).
- **Layouts (`layout.tsx`):** Define shared UI structures around routes.
- **Pages (`page.tsx`):** Define the unique UI for a route segment.
- **Loading UI (`loading.tsx`):** Convention for showing loading states during navigation (implicitly uses React Suspense).
- **Error Handling (`error.tsx`):** Convention for handling runtime errors within a route segment. 
- **Dynamic Segments (`[id]`):** Used for routes like `app/details/[id]` and `app/edit/[id]`.
- **Metadata API:** `generateMetadata` used in `app/details/[id]/page.tsx` for dynamic page titles/descriptions.

## Folder Structure

- **`app/`**: Contains all routes and their associated UI components (Pages, Layouts, Loading/Error files, route-specific `_components`).
- **`components/`**: Shared React components, independent of specific routes.
  - **`ui/`**: Core UI primitives based on shadcn/ui (Button, Card, Input, etc.). Generally stateless and reusable.
  - **`layout/`**: Components defining major layout structures (e.g., `MainContainer`).
- **`lib/`**: Core application logic, type definitions, utility functions, API clients, and state management stores. Not React components.
  - **`data/`**: Functions intended for server-side data fetching.
  - **`api-clients.ts`**: Functions making direct calls to external APIs (e.g., CryptoCompare).
  - **`store.ts`**: Zustand store definitions.
  - **`utils.ts`**: General helper functions.
  - **`types.ts`**: TypeScript definitions.
- **`hooks/`**: Custom React hooks, often used for client-side logic or data fetching (`useCryptoData.ts`, `use-media-query.ts`).
- **`public/`**: Static assets served directly (images, fonts, icons).
- **`docs/`**: Project documentation (this file, README, etc.).
- **`tests/`**: Integration/component tests (using Jest/React Testing Library).
- **`e2e/`**: End-to-end tests (using Playwright).

## Data Flow (Conceptual)

1.  **Initial Page Load (e.g., `/details/[id]`):**
    *   Next.js renders the Server Component (`app/details/[id]/page.tsx`).
    *   `page.tsx` calls server-side fetching functions (`fetchCryptoDetails` in `lib/data/crypto.ts`).
    *   Data is passed as props to Server Components (`AssetHeader`) and Client Components (`PriceChartSection`).
2.  **Client-Side Hydration:**
    *   Client Components (`"use client"`) hydrate.
    *   Zustand store (`usePortfolioStore`) hydrates from Local Storage (loading saved `holdings`). **Note:** Initial server render has no holdings data due to `fetchHoldings` having no server store `[]`.
    *   Components using Zustand (`UserHoldingControls`) show a loading/skeleton state until hydration completes.
3.  **Client-Side Data Fetching:**
    *   Client Components needing live/additional data (`PriceChartSection`, dashboard components) use hooks (`useHistoricalData`, `useCryptoPrices` in `hooks/useCryptoData.ts`).
    *   These hooks utilize TanStack Query (`useQuery`) to fetch data via `lib/api-clients.ts`, handle caching, loading/error states, and background updates.
4.  **State Updates:**
    *   User interactions (e.g., adding/editing holdings via `HoldingForm`) trigger mutations (`useAddHoldingMutation` in `hooks/useCryptoData.ts`).
    *   Mutations update the Zustand store (`usePortfolioStore`).
    *   Components subscribed to Zustand re-render.
    *   Mutations may invalidate TanStack Query caches (`queryClient.invalidateQueries`) to refetch relevant API data.

*(See `docs/DATA_FETCHING.md` and `docs/STATE_MANAGEMENT.md` for more details)*

## Key Libraries & Their Roles

- **Zustand:** Manages global client-side state, particularly user portfolio holdings and persistent table settings (sorting/filtering). Chosen for its simplicity.
- **TanStack Query (React Query):** Manages server state caching on the client. Handles asynchronous operations (API calls), caching, background updates, and request deduplication for price/market data.
- **Recharts:** Used for rendering charts (Bar chart in `PortfolioValueCard`, Pie chart in `PortfolioDistribution`, Bar chart in `PriceChart`).
- **Framer Motion:** Used for animations, notably in the `ResponsiveDialog` component for the bottom sheet transition and drag interaction.
- **shadcn/ui & Radix UI:** Provide the base for accessible, unstyled UI primitives and styled components, integrating seamlessly with Tailwind CSS.
- **React Hook Form & Zod:** Provide a robust solution for form handling and schema-based validation in `HoldingForm`.
- **Biome:** Ensures code consistency through formatting and linting.