# Asset Details Components (`app/details/[id]/_components/`)

This directory contains React components specifically used for the dynamic Asset Details page (`app/details/[id]/page.tsx`). These components display detailed information about a specific cryptocurrency, including its price, stats, description, links, and user-specific holding information.

## Key Components

*   **`AssetHeader.tsx`**: (Server Component) Displays the primary identification block for the asset, including name, symbol, image, rank, and type/industry badges. Receives `detailsData` from the page.
*   **`AssetStatsBlock.tsx`**: (Server Component) Shows key market statistics like current price, 24h/7d/30d change, market cap, volume, and supply details. Receives `detailsData` and optionally `footerContent` (used for `UserHoldingControls`).
*   **`UserHoldingControls.tsx`**: (Client Component) If the user holds the current asset, this component (rendered in the footer of `AssetStatsBlock`) displays their holding quantity/value and provides "Edit" and "Delete" buttons, opening respective dialogs.
*   **`PriceChartSection.tsx`**: (Client Component) Fetches and displays the historical price chart (`PriceChart`) for the asset, including timeframe selection buttons. Uses `useHistoricalData` hook.
*   **`KeyInfoBlock.tsx`**: (Server Component) Displays miscellaneous key information like genesis date, hashing algorithm, issuer, supply details, and custodians. Receives `detailsData`.
*   **`LinksAccordion.tsx`**: (Server Component) Renders official website links, explorer links, social media links, documents (like whitepaper), and platform links (CoinGecko/CMC) within an accordion. Receives `detailsData`.
*   **`AboutAsset.tsx`**: (Server Component) Displays the descriptive summary text for the asset. Receives `detailsData`.
*   **`AvailableNetworks.tsx`**: (Server Component) Lists the blockchain networks the asset is available on, often including explorer links and token standards. Receives `detailsData`.
*   **`ReservesBreakdown.tsx`**: (Client Component) If applicable (e.g., for stablecoins), displays a pie chart showing the composition of the asset's reserves. Receives `detailsData`.
*   **`DetailsNavigation.tsx`**: (Client Component) Provides "Previous" and "Next" buttons to navigate between the detail pages of assets held in the user's portfolio. Uses `usePortfolioStore` to get the ordered list of holdings.
*   **`RefreshButton.tsx`**: (Client Component) A simple button that uses `router.refresh()` to re-fetch server component data for the current page.
*   **`details-skeletons.tsx`**: Contains skeleton components used as loading fallbacks (via `Suspense`) for the client components (`PriceChartSection`, `ReservesBreakdown`) and the overall page structure (`DetailsPageSkeleton` used in `app/details/[id]/loading.tsx`).

## Data Flow

- The main `app/details/[id]/page.tsx` (Server Component) fetches the primary `detailsData` using `fetchCryptoDetails`.
- This `detailsData` is passed down as props to the various Server Components (`AssetHeader`, `AssetStatsBlock`, `KeyInfoBlock`, `LinksAccordion`, etc.).
- Client Components like `PriceChartSection` and potentially `ReservesBreakdown` fetch their own specific data using custom hooks (`useHistoricalData`).
- `UserHoldingControls` and `DetailsNavigation` interact with the client-side Zustand store (`usePortfolioStore`) to access user-specific portfolio state. 