# Component Structure and Library

This document provides an overview of how React components are organized and utilized within the application.

## Core UI Library: shadcn/ui (`components/ui/`)

- **Foundation:** The application leverages [shadcn/ui](https://ui.shadcn.com/) for its core UI component library.
- **Pattern:** shadcn/ui components are typically built by combining:
  - Accessible, unstyled primitives from [Radix UI](https://www.radix-ui.com/).
  - Styling via [Tailwind CSS](https://tailwindcss.com/) utility classes.
  - Variant management using `class-variance-authority` (CVA).
  - Class merging via `clsx` and `tailwind-merge` (using the `cn` utility from `lib/utils.ts`).
- **Location:** Standard shadcn/ui components (Button, Card, Input, Dialog, Table, Select, etc.) reside in `components/ui/`.
- **Customization:** These components are customized via the Tailwind theme (`tailwind.config.ts`) and can be further modified directly if needed.
- **Custom UI Additions:** Some custom components following a similar pattern exist within `components/ui/`, such as:
  - `DataCard`: A specialized card component with slots for titles, header content, and loading states.
  - `PriceChangeLabel`: Displays formatted price changes (percentage/absolute) with appropriate coloring.
  - `MarketStat`: Simple component for displaying a label/value pair, often used in stat blocks.
  - `CoinIdentifier`: Renders a coin's image (with fallback) and name/symbol.

## Layout Components (`components/layout/`)

- **`MainContainer`**: A wrapper component applying consistent padding, max-width, and a fade-in animation for primary page content areas. Uses the `<main>` HTML tag.

## Shared Components (`components/`)

These are more complex components, potentially composed of `ui/` primitives, used across different routes or features.

- **`HoldingForm`**: A comprehensive form (using `react-hook-form` and `zod`) for adding or editing crypto holdings. Includes logic for fetching the crypto list, validation, and interacting with Zustand mutations.
- **`ResponsiveDialog`**: A dialog component that displays as a standard modal on desktop and a draggable bottom sheet on mobile (using `framer-motion`).
- **`PriceChart`**: The core charting component (Recharts) responsible for rendering the price chart based on provided data.
- **`AddHoldingButton`**: Simple button often used to trigger the add holding flow.
- **`ErrorBoundary`**: A standard React Error Boundary component used to wrap sections (especially client components fetching data) to prevent UI crashes.

## Route-Specific Components (`app/.../_components/`)

- **Convention:** Components that are specific to a particular route segment (e.g., the dashboard, the details page) are co-located within a `_components` subdirectory inside that route's folder (e.g., `app/dashboard/_components/`, `app/details/[id]/_components/`).
- **Examples:**
  - `HoldingsList`, `PortfolioValueCard`, `PortfolioActivity`, `PortfolioDistribution` (Dashboard specific).
  - `AssetHeader`, `AssetStatsBlock`, `PriceChartSection`, `UserHoldingControls` (Details page specific).
- **Reusability:** These components are generally not intended for reuse outside their specific route context.

## Skeletons

- Skeleton loading components are defined alongside the components they represent (e.g., `app/dashboard/_components/dashboard-skeletons.tsx`, `app/details/[id]/_components/details-skeletons.tsx`).
- They use the `Skeleton` primitive from `components/ui/skeleton`.
- Used as `fallback` props in `<Suspense>` boundaries.