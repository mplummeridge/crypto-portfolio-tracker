# Library (`lib/`)

This directory contains core logic, utilities, data fetching functions, state management, custom hooks, and type definitions shared across the application.

## Key Subdirectories & Files

*   **`api-clients.ts`**: Contains functions (`fetchCryptoComparePricesFull`, `fetchCryptoCompareHistory`) for directly interacting with external cryptocurrency APIs (currently focused on CryptoCompare). Handles API key authorization and basic request setup.
*   **`colors.ts`**: Provides utility functions (`getAssetColor`) for assigning consistent colors to different cryptocurrency assets, likely used in charts.
*   **`coindesk-api.ts`**: Contains functions related to fetching data from the CoinDesk/Messari API.
*   **`mock-data.ts`**: Defines static mock data structures (like `MOCK_CRYPTOS`) used for development, testing, or fallback scenarios.
*   **`mock-data-generators.ts`**: Provides functions to dynamically generate mock data (prices, details) simulating API responses, often including simulated delays.
*   **`store.ts`**: Defines the application's client-side state management using Zustand (`usePortfolioStore`). Manages holdings, table state (sorting, filtering), UI state (dialogs) and associated actions/setters.
*   **`utils.ts`**: Contains various utility functions for formatting (currency, numbers, dates, percentages), data mapping (`mapCoinIdToSymbol`), class name merging (`cn`), and potentially other common helper functions.
*   **`utils.test.ts`**: Unit tests for functions within `utils.ts`.
*   **`data/`**: Contains server-side data fetching functions related to specific data domains.
    *   `crypto.ts`: Functions like `fetchCryptoDetails` and `fetchCryptoPricesBulk` for fetching detailed asset information and bulk prices (intended for Server Components or API Routes).
    *   `portfolio.ts`: Functions like `fetchHoldings` (currently returns mock/empty data in this client-focused setup).
*   **`hooks/`**: Contains reusable React hooks.
    *   `useCryptoData.ts`: High-level hooks (`useCryptoList`, `useHistoricalData`, `useAddHoldingMutation`, etc.) built on top of React Query and the data fetching functions in `lib/data/` or `lib/api-clients.ts`. These manage fetching, caching, and state for crypto data within client components.
    *   `usePortfolioData.ts`: A hook that aggregates data from the `usePortfolioStore` and potentially `useCryptoData` hooks to provide processed data (e.g., `processedHoldings`, `chartData`, calculated totals/changes) ready for consumption by UI components.
    *   `useMediaQuery.ts`: A simple hook to detect screen size based on a media query.
*   **`types/`**: Contains shared TypeScript type definitions.
    *   `crypto.ts`: Types related to cryptocurrency data (`CryptoCurrency`, `CryptoDetails`, etc.).
    *   `global.ts`: Types for global market data.
    - `holding.ts`: Types related to user portfolio holdings.
    - `util.ts`: Utility types.