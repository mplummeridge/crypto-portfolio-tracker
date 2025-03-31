# Custom Hooks (`lib/hooks/`)

This directory contains custom React hooks used throughout the application, primarily for data fetching, state management related to data, and utility purposes.

## Key Hooks

*   **`useCryptoData.ts`**: Provides hooks built on top of React Query (`@tanstack/react-query`) for fetching cryptocurrency data. These handle caching, background updates, and error states.
    *   `useCryptoList()`: Fetches the list of available cryptocurrencies (see selection dropdown in `components/holding-form.tsx`).
    *   `useHistoricalData(coinId, timeframe)`: Fetches historical price data (OHLC) for a specific asset and timeframe.
    *   `useCryptoDetails(coinId)`: Fetches detailed information for a single cryptocurrency.
    *   `useAddHoldingMutation()` / `useUpdateHoldingMutation()` / `useDeleteHoldingMutation()`: Provides mutation functions (via React Query) to interact with the portfolio state (adding, updating, deleting holdings).
*   **`usePortfolioData.ts`**: A hook that combines data from the `usePortfolioStore` (user holdings) with fetched price/market data (from `useCryptoData` hooks or their underlying fetchers). It computes derived values like total portfolio value, individual holding values, 24-hour changes (absolute and percentage), data formatted for charts (`chartData`), and lists of top gainers/losers (`topMoversList`). This hook centralizes the logic for preparing portfolio data for display in UI components.
*   **`useMediaQuery.ts`**: A simple client-side hook that takes a CSS media query string and returns a boolean indicating whether the query currently matches. Used for responsive rendering logic.
*   **`use-toast.ts` (in `components/ui`)**: While not strictly in this directory, this hook manages the global toast notification state, allowing components to trigger toasts.

## Usage

These hooks are typically used in Client Components (`"use client"`) to fetch data or access shared state.

- Data fetching hooks (`useCryptoData`, `useHistoricalData`, `useCryptoDetails`) require `QueryClientProvider` to be set up (usually in `app/providers.tsx`).
- `usePortfolioData` relies on both the React Query client and the Zustand store (`usePortfolioStore`).
- `useMediaQuery` is a standalone utility hook. 