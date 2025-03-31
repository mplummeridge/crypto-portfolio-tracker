# State Management Strategy

This document outlines the different state management approaches used within the application.

## Overview

The application utilizes a combination of state management tools, chosen based on the type and scope of the state:

1.  **Zustand:** For global client-side state, particularly user-specific data that needs to persist across sessions (like portfolio holdings) or UI state shared across disconnected components.
2.  **TanStack Query (React Query):** For managing server state on the client – caching, synchronizing, and updating data fetched from external APIs.
3.  **React Local State (`useState`, `useReducer`):** For ephemeral UI state confined to a single component or a small, co-located group of components.

## Zustand (`lib/store.ts`)

Zustand is used for managing state that is truly client-side or needs to be shared globally across the application after hydration.

- **`usePortfolioStore`:**
  - **Purpose:** Manages the core user portfolio and related UI state.
  - **State:**
    - `holdings: CryptoHolding[]`: The definitive list of user's crypto holdings *on the client*.
    - `isAddHoldingDialogOpen: boolean`: Controls visibility of the add holding dialog.
    - `hoveredSymbol: string | null`: Tracks asset symbol hovered in charts/tables for cross-component interaction effects.
    - `tableSorting: SortingState`: Persisted sorting state for the `HoldingsList` TanStack Table.
    - `tableGlobalFilter: string`: Persisted global filter string for the `HoldingsList`.
    - `orderedHoldings: OrderedHoldingData[]`: *Currently stores* a minimal representation of holdings in the order displayed in `HoldingsList` (after sort/filter). Used by `DetailsNavigation`. TODO: check if this is redundant state; consider deriving it when needed.
  - **Persistence:** Uses `zustand/middleware/persist` to save state to Local Storage. The `partialize` option is used to *exclude* transient UI state (`hoveredSymbol`, `isAddHoldingDialogOpen`, `orderedHoldings`) while persisting `holdings`, `tableSorting`, and `tableGlobalFilter`.
  - **Actions:** Provides standard actions (`addHolding`, `removeHolding`, `updateHolding`) and setters.

## TanStack Query (React Query)

TanStack Query v5 is used exclusively for managing **server state** on the client side. It simplifies fetching, caching, and updating data from the CryptoCompare and CoinDesk APIs.

- **Usage:** Implemented via custom hooks in `hooks/useCryptoData.ts` (`useCryptoPrices`, `useHistoricalData`, `useCryptoList`, `useCryptoDetails`).
- **Key Features Used:**
  - `useQuery`: For fetching and caching data.
  - `useMutation`: For operations that modify server-side data (though in this app, mutations primarily modify the client-side Zustand store and then invalidate queries).
  - **Caching:** Manages `staleTime` and `gcTime` to control when data is considered fresh or garbage collected.
  - **Background Updates:** Uses `refetchInterval` (in `useCryptoPrices`) and `refetchOnWindowFocus` (default, can be disabled) to keep data up-to-date.
  - **Loading/Error States:** Provides boolean flags (`isLoading`, `isError`, `isFetching`) used by components to render appropriate UI feedback (skeletons, error messages).
  - **Query Keys:** Used to identify and manage cached data. Keys typically include the query name and relevant parameters (e.g., `["cryptoPricesFull", sortedIds, targetCurrency]`).
  - **Query Invalidation:** `queryClient.invalidateQueries` is used in mutation `onSuccess` callbacks to mark related data as stale, triggering refetches.

**Distinction:** TanStack Query manages the *cache* of data fetched from the API (server state), while Zustand manages the user's specific portfolio data and global UI state (client state).

## React Local State (`useState`, `useReducer`)

Standard React hooks are used for state that is local to a single component or a small group of closely related components.

- **Examples:**
  - `isEditing`, `isDeleting` in `UserHoldingControls` (controls dialog visibility).
  - `timeframe` in `PriceChartSection` (controls selected chart timeframe).
  - `isHydrated` in `UserHoldingControls` (manages client-side hydration state).
  - `isNavigating` in `DetailsNavigation` (provides UI feedback during navigation).
  - Form state within `HoldingForm` managed by `react-hook-form` (which uses local state internally).

This separation helps keep state management organized and predictable.