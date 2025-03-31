# Dashboard Components (`app/dashboard/_components/`)

This directory contains React components specifically designed for the main Crypto Dashboard page (`app/dashboard/page.tsx`). These components handle the display of portfolio overview, holdings list, market activity, and user interactions related to adding/managing holdings.

## Key Components

*   **`PortfolioValueCard.tsx`**: Displays the total portfolio value and a bar chart breakdown by asset value. Uses `usePortfolioData` hook for data.
*   **`HoldingsList.tsx`**: Renders the main interactive table of user holdings. It utilizes `@tanstack/react-table` for sorting, filtering, and expansion. It uses `usePortfolioData` for holding data and interacts with `usePortfolioStore` for table state (sorting, filtering) and actions (edit/delete).
*   **`HoldingsTable.tsx`**: The core table rendering logic used by `HoldingsList.tsx`.
*   **`PortfolioDistribution.tsx`**: Shows a pie chart visualizing the portfolio's asset allocation by value. Uses `usePortfolioData`.
*   **`PortfolioActivity.tsx`**: Displays 24-hour portfolio change (percentage and absolute) and lists the top moving assets. Uses `usePortfolioData`.
*   **`AddHoldingDialog.tsx`**: Provides the dialog/panel UI (using `ResponsiveDialog`) for adding a new holding via the `HoldingForm`. Interacts with `usePortfolioStore` to manage its open state.
*   **`HoldingForm.tsx` (imported from `@/components`)**: The actual form used within `AddHoldingDialog` and also for editing holdings.
*   **`HoldingsListFilter.tsx`**: The search input component used to filter the `HoldingsList` table. Interacts with `usePortfolioStore`.
*   **`SortableTableHeader.tsx`**: A reusable component for table headers that allows sorting. Used within `HoldingsList` columns.
*   **`MobileAddHoldingButton.tsx`**: A wrapper for the `AddHoldingButton` specifically for the mobile view's fixed button area. Interacts with `usePortfolioStore`.
*   **`dashboard-skeletons.tsx`**: Contains various skeleton components used as loading fallbacks for the main dashboard components within `Suspense` boundaries.

## Data Flow & State Management

- Most data-display components rely on the `usePortfolioData` hook (`@/hooks/usePortfolioData`) to fetch and process portfolio information (holdings, prices, calculated values).
- User interactions and table state (like sorting, filtering, dialog open states) are primarily managed through the Zustand store defined in `usePortfolioStore` (`@/lib/store`). 