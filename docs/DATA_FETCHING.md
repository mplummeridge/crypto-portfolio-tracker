# Data Fetching Strategy

This document details how the application fetches data from external APIs and manages it, covering both server-side and client-side strategies.

## APIs Used

- **CryptoCompare API:** The primary source for cryptocurrency data.
  - Base URL (min-api): `https://min-api.cryptocompare.com/data`
  - Base URL (asset data): `https://data-api.cryptocompare.com/asset/v1` (Configurable via `.env.local`)
  - Key Endpoints Used:
    - `/pricemultifull`: Fetches full price, market cap, volume, change data for multiple symbols (Used by client-side `useCryptoPrices` via `fetchCryptoComparePricesFull`).
    - `/asset/v1/data/by/symbol`: Fetches detailed metadata and market stats for a single asset (Used by server-side `fetchCryptoDetails` and client-side `useCryptoDetails` via `fetchMarketDataBySymbol`).
    - `/v2/histoday`: Fetches daily OHLC historical data (Used by client-side `useHistoricalData` via `fetchCryptoCompareHistory`).
- **CoinDesk API:** Used *only* by the `useCryptoList` hook to fetch a list of available cryptocurrencies for the "Add Holding" dropdown. Uses same key.

## API Key Management

- **Configuration:** API keys are expected to be configured in a `.env.local` file (create by copying `.env.example`).

## Server-Side Fetching (`lib/data/`)

Functions in this directory are designed to be called from Server Components during the server render.

- **`fetchCryptoDetails(coinId)`:** Fetches detailed metadata for a single asset from the CryptoCompare `/asset/v1` endpoint. Used by `app/details/[id]/page.tsx`. Implements Next.js fetch caching (`revalidate: 300`).
- **`fetchCryptoPricesBulk(coinIds)`:** Fetches basic price/market data for multiple assets using `fetchCryptoComparePricesFull`. Called by `app/page.tsx` to get initial prices for holdings (though holdings are fetched client-side). Relies on underlying caching in `fetchCryptoComparePricesFull` 
- **`fetchHoldings()`:** **CURRENTLY RETURNS `[]`**. This function would  fetch the user's portfolio holdings server-side if implemented. However, the current implementation relies on client-side storage (Zustand + Local Storage). 

## Client-Side Fetching (`hooks/useCryptoData.ts`)

Custom hooks leveraging TanStack Query (React Query) handle data fetching initiated from Client Components.

- **`useCryptoPrices(ids)`:** Fetches full price/market data (`pricemultifull`) for the specified asset IDs. Used by dashboard components (`HoldingsList`, `PortfolioValueCard`, etc.) to get live updates. Uses TanStack Query for caching (`staleTime`, `refetchInterval`), loading/error states.
- **`useHistoricalData(id, timeframe)`:** Fetches daily historical OHLC data (`histoday`) for the specified asset and timeframe. Used by `PriceChartSection`. Uses TanStack Query for caching.
- **`useCryptoList()`:** Fetches the list of available cryptos from CoinDesk/Messari API. Used by `HoldingForm`. Caches indefinitely (`staleTime: Infinity`).
- **`useCryptoDetails(id)`:** Fetches detailed asset data client-side using `fetchMarketDataBySymbol`. Uses TanStack Query.
- **Mutations (`useAddHoldingMutation`, etc.):** These hooks don't fetch data but interact with the Zustand store and invalidate relevant TanStack Query caches (`queryClient.invalidateQueries`) upon success to trigger data refetches.

## Mock Data

- Set the `NEXT_PUBLIC_USE_MOCK_DATA=true` environment variable in `.env.local` to enable mock data generation instead of hitting live APIs.
- Mock generation logic is primarily in `lib/mock-data-generators.ts`.

## Caching Strategy

- **Server-Side:** Next.js fetch cache (`revalidate`) is used in `fetchCryptoDetails`. Other server fetches currently rely on default fetch behavior or underlying client caching.
- **Client-Side:** TanStack Query is the primary caching layer for client-initiated fetches (`useCryptoPrices`, `useHistoricalData`, `useCryptoList`). It handles `staleTime`, `gcTime`, background refetches (`refetchInterval`), and deduplication.