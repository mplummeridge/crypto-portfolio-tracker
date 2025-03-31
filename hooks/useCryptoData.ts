import type { OHLCData } from "@/app/api/crypto/types";
import {
  fetchCryptoCompareCoinList,
  fetchCryptoCompareHistory,
  fetchCryptoComparePricesFull,
  fetchMarketDataBySymbol,
} from "@/lib/api-clients";
import { fetchCoinDeskTopList } from "@/lib/coindesk-api";
import {
  generateMockPrices,
  timeframeToDays,
} from "@/lib/mock-data-generators";
import { usePortfolioStore } from "@/lib/store";
import { mapCoinIdsToSymbols } from "@/lib/utils";
import type { CoinDeskAsset } from "@/types/api/coindesk";
import type {
  AssetData,
  CryptoCompareCoinListResponse,
  CryptoCompareHistoryDataPoint,
  CryptoComparePriceData,
} from "@/types/api/cryptocompare";
import type { CryptoSearchResult, ExtendedCryptoDetails } from "@/types/crypto";
import type { CryptoHolding } from "@/types/holding";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Define Timeframe locally
export type Timeframe = "1d" | "7d" | "30d" | "90d" | "1y" | "all" | "max";

// --- Constants ---
const CRYPTO_LIST_COMBINED_QUERY_KEY = "cryptoListCombined";
const CRYPTO_COMPARE_COIN_LIST_QUERY_KEY = "cryptoCompareCoinList";
const COIN_DESK_TOP_LIST_QUERY_KEY = "coinDeskTopList";
const CRYPTO_LIST_MOCK_QUERY_KEY = "cryptoListMock";
const CRYPTO_PRICES_QUERY_KEY = "cryptoPricesFull";

/**
 * Hook to fetch cryptocurrency prices using React Query.
 * Handles fetching live data from CryptoCompare or generating mock data.
 *
 * @param ids - Array of cryptocurrency IDs (e.g., ["bitcoin", "ethereum"]). Case-insensitive.
 * @param targetCurrency - The target currency symbol (e.g., "USD"). Defaults to 'USD'.
 * @param options - Optional React Query options.
 * @returns React Query result object containing price data (Record<string, CryptoComparePriceData>), loading state, etc.
 */
export function useCryptoPrices(
  ids: string[],
  targetCurrency = "USD",
  options: { enabled?: boolean } = { enabled: true },
) {
  const queryKey = ["cryptoPricesFull", ids.sort(), targetCurrency];

  return useQuery<Record<string, CryptoComparePriceData>, Error>({
    queryKey: queryKey,
    /**
     * Fetches full price data for the requested crypto IDs.
     * 1. Maps the input IDs (e.g., "bitcoin") to their corresponding symbols (e.g., "BTC")
     *    as the CryptoCompare API requires symbols.
     * 2. Creates a reverse map (symbol -> original ID) to process the response later.
     * 3. Calls the `fetchCryptoComparePricesFull` API with the list of symbols.
     * 4. Processes the `RAW` part of the API response, which contains the detailed price data per symbol.
     * 5. Uses the reverse map to transform the symbol-keyed response back into an ID-keyed record.
     * Returns mock data if NEXT_PUBLIC_USE_MOCK_DATA is true.
     */
    queryFn: async () => {
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

      if (useMockData) {
        // console.log(
        //   `[React Query] Using mock data for queryKey: ${JSON.stringify(queryKey)}`,
        // );
        // Reverted to original mock function call
        return generateMockPrices(ids, targetCurrency);
      }

      // console.log(
      //   `[React Query] Fetching live full prices for queryKey: ${JSON.stringify(queryKey)}`,
      // );

      // Map the provided IDs (e.g., "bitcoin") to API-compatible symbols (e.g., "BTC")
      const idToSymbolMapResult = mapCoinIdsToSymbols(ids);
      // Create a reverse map to link symbols back to the original IDs when processing the API response
      const symbolToIdMap: Record<string, string> = {};
      const symbolsToFetch: string[] = [];

      for (const [id, symbol] of Object.entries(idToSymbolMapResult)) {
        if (symbol) {
          symbolsToFetch.push(symbol);
          symbolToIdMap[symbol] = id;
        } else {
          // console.warn(
          //   `useCryptoPrices: Could not map coin ID '${id}' to a symbol.`,
          // );
        }
      }

      if (symbolsToFetch.length === 0) {
        // console.warn(
        //   "useCryptoPrices: No valid symbols found to fetch live full prices. Returning empty object.",
        // );
        return {};
      }

      const apiResponse = await fetchCryptoComparePricesFull(symbolsToFetch, [
        targetCurrency.toUpperCase(),
      ]);

      if (!apiResponse || !apiResponse.RAW) {
        // console.warn(
        //   "useCryptoPrices: API call failed, returned null, or missing RAW data. Returning empty price object.",
        // );
        return {};
      }

      const liveData: Record<string, CryptoComparePriceData> = {};
      let dataFound = false;

      // Iterate through the RAW data returned by the API.
      // The RAW object is keyed by the *symbol* (e.g., "BTC").
      // Each symbol maps to an object keyed by the target currency (e.g., "USD").
      const target = targetCurrency.toUpperCase();
      for (const [symbol, currencyData] of Object.entries(apiResponse.RAW) as [
        string,
        Record<string, CryptoComparePriceData>,
      ][]) {
        // Extract the price data for the specific target currency.
        const priceDataForTarget = currencyData?.[target];
        if (priceDataForTarget) {
          // Use the reverse map created earlier to find the original ID corresponding to this symbol.
          const originalId = symbolToIdMap[symbol];
          if (originalId) {
            // Assign the price data to the correct original ID in our result object.
            liveData[originalId] = priceDataForTarget;
            dataFound = true;
          } else {
            // This case should theoretically not happen if symbolToIdMap is correct
            // console.warn(
            //   `useCryptoPrices: Received data for symbol '${symbol}' which wasn't in the original request mapping.`,
            // );
          }
        } else {
          // console.warn(
          //   `useCryptoPrices: Full price data not found for symbol '${symbol}' in target currency '${target}' from API response.`,
          // );
        }
      }

      if (!dataFound && ids.length > 0) {
        // console.warn(
        //   "useCryptoPrices: No full price data found for any requested symbols in the API response.",
        // );
      }

      return liveData;
    },
    enabled: options.enabled && ids && ids.length > 0,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}

/**
 * Transforms raw API data from fetchMarketDataBySymbol into the application's CryptoDetails format.
 * @param apiData - The raw AssetData object from the API response (apiResponse.Data).
 * @returns A partial CryptoDetails object.
 */
function transformMarketDataToDetails(
  apiData: AssetData,
  inputId: string,
): ExtendedCryptoDetails {
  const hashing_algorithm = apiData.HASHING_ALGORITHM ?? null;

  // Map fields from the API response (AssetData) to ExtendedCryptoDetails
  return {
    id: inputId,
    symbol: apiData.SYMBOL,
    name: apiData.NAME || apiData.SYMBOL,
    currentPrice: apiData.PRICE_USD ?? 0,
    description: {
      en: apiData.ASSET_DESCRIPTION || apiData.ASSET_DESCRIPTION_SNIPPET,
    },
    image: apiData.LOGO_URL, // Use LOGO_URL directly
    links: {
      // Map links
      homepage: apiData.WEBSITE_URL ? [apiData.WEBSITE_URL] : [],
      // Use SUPPORTED_PLATFORMS for explorer links if needed, or keep specific field if exists
      blockchain_site:
        (apiData.SUPPORTED_PLATFORMS?.map((p) => p.EXPLORER_URL).filter(
          Boolean,
        ) as string[]) || [],
      official_forum_url: [], // Map if available in API data
      subreddit_url: apiData.SUBREDDITS?.[0]?.URL,
      twitter_screen_name: apiData.TWITTER_ACCOUNTS?.[0]?.USERNAME,
      repos_url: {
        github:
          apiData.CODE_REPOSITORIES?.filter((r) =>
            r.URL.includes("github"),
          ).map((r) => r.URL) || [],
      },
    },
    market_data: {
      current_price: { usd: apiData.PRICE_USD ?? 0 },
      market_cap: { usd: apiData.CIRCULATING_MKT_CAP_USD ?? 0 },
      total_volume: { usd: apiData.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD ?? 0 },
      price_change_percentage_24h:
        apiData.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD,
      price_change_percentage_7d:
        apiData.SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD,
      price_change_percentage_30d:
        apiData.SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD,
      circulating_supply: apiData.SUPPLY_CIRCULATING,
    },
    genesis_date: apiData.LAUNCH_DATE
      ? new Date(apiData.LAUNCH_DATE * 1000).toISOString()
      : null,
    marketCapRank: apiData.TOPLIST_BASE_RANK?.CIRCULATING_MKT_CAP_RANK,
    SUPPORTED_PLATFORMS: apiData.SUPPORTED_PLATFORMS?.map((p) => ({
      BLOCKCHAIN: p.BLOCKCHAIN,
      TOKEN_STANDARD: p.TOKEN_STANDARD,
      EXPLORER_URL: p.EXPLORER_URL,
      SMART_CONTRACT_ADDRESS: p.SMART_CONTRACT_ADDRESS,
    })),
    RESERVES_BREAKDOWN: apiData.RESERVES_BREAKDOWN?.map((r) => ({
      RESERVE_TYPE: r.RESERVE_TYPE,
      PERCENTAGE: r.PERCENTAGE,
      DESCRIPTION: r.DESCRIPTION,
    })),
    ASSET_TYPE: apiData.ASSET_TYPE,
    ASSET_ISSUER_NAME: apiData.ASSET_ISSUER_NAME,
    ASSET_INDUSTRIES: apiData.ASSET_INDUSTRIES?.map((i) => ({
      ASSET_INDUSTRY: i.ASSET_INDUSTRY,
    })),
    SUPPLY_TOTAL: apiData.SUPPLY_TOTAL,
    SUPPLY_ISSUED: apiData.SUPPLY_ISSUED,
    SUPPLY_LOCKED: apiData.SUPPLY_LOCKED,
    ASSET_SECURITY_METRICS: apiData.ASSET_SECURITY_METRICS?.map((m) => ({
      NAME: m.NAME,
      OVERALL_SCORE: m.OVERALL_SCORE,
    })),
    ASSET_CUSTODIANS: apiData.ASSET_CUSTODIANS?.map((c) => ({ NAME: c.NAME })),
    ASSET_ALTERNATIVE_IDS: apiData.ASSET_ALTERNATIVE_IDS?.map((a) => ({
      NAME: a.NAME,
      ID: a.ID,
    })),
    TOPLIST_BASE_RANK: apiData.TOPLIST_BASE_RANK,
    ASSET_DESCRIPTION: apiData.ASSET_DESCRIPTION,
    ASSET_DESCRIPTION_SUMMARY: apiData.ASSET_DESCRIPTION_SUMMARY,
    WHITE_PAPER_URL: apiData.WHITE_PAPER_URL,
    OTHER_DOCUMENT_URLS: apiData.OTHER_DOCUMENT_URLS?.map((d) => ({
      TYPE: d.TYPE,
      URL: d.URL,
    })),
    OTHER_SOCIAL_NETWORKS: apiData.OTHER_SOCIAL_NETWORKS?.map((s) => ({
      NAME: s.NAME,
      URL: s.URL,
    })),
    sentiment_votes_up_percentage: undefined,
    sentiment_votes_down_percentage: undefined,
    watchlist_portfolio_users: undefined,
    hashing_algorithm: hashing_algorithm,
    categories: apiData.ASSET_INDUSTRIES?.map((i) => i.ASSET_INDUSTRY),
  };
}

/**
 * Hook to fetch detailed cryptocurrency information using React Query.
 *
 * @param id - The cryptocurrency ID used within the application (e.g., "bitcoin").
 * @param options - Optional React Query options.
 * @returns React Query result object containing CryptoDetails data, loading state, etc.
 */
function useCryptoDetails(
  id: string | null | undefined,
  options: { enabled?: boolean } = { enabled: true },
) {
  const queryKey = ["cryptoDetails", id];

  return useQuery<ExtendedCryptoDetails | null, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!id) return null;

      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

      if (useMockData) {
        // console.log(
        //   `[React Query] Using mock data for queryKey: ${JSON.stringify(queryKey)}`,
        // );
        return null;
      }

      // console.log(
      //   `[React Query] Fetching live details for queryKey: ${JSON.stringify(queryKey)}`,
      // );

      const symbolsMap = mapCoinIdsToSymbols([id]);
      const symbol = symbolsMap[id]?.toUpperCase();

      if (!symbol) {
        // console.warn(`Symbol not found for ID: ${id}. Cannot fetch details.`);
        return null; // Or throw error?
      }

      const apiResponse = await fetchMarketDataBySymbol(symbol);

      if (!apiResponse || !apiResponse.Data) {
        // console.warn(
        //   `Failed to fetch or find details for ${id} (${symbol}) from API.`,
        // );
        return null;
      }

      const transformedData = transformMarketDataToDetails(
        apiResponse.Data,
        id,
      );

      return transformedData;
    },
    enabled: options.enabled && !!id,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Transforms CryptoCompare historical data into OHLC format for candlestick charts.
 * @param historyData - The array of data points from CryptoCompare API.
 * @returns An array formatted as OHLCData.
 */
function transformHistoryToOHLC(
  historyData: CryptoCompareHistoryDataPoint[],
): OHLCData[] {
  return historyData.map((point) => ({
    timestamp: point.time * 1000,
    open: point.open,
    high: point.high,
    low: point.low,
    close: point.close,
  }));
}

/**
 * Hook to fetch historical price data for a cryptocurrency using React Query.
 *
 * @param id - The cryptocurrency ID (e.g., "bitcoin").
 * @param timeframe - The time range (e.g., "7d", "30d").
 * @param options - Optional React Query options.
 * @returns React Query result object containing OHLCData[], loading state, etc.
 */
export function useHistoricalData(
  id: string | null | undefined,
  timeframe: Timeframe = "30d",
  targetCurrency = "USD",
  options: { enabled?: boolean } = { enabled: true },
) {
  const queryKey = ["historicalData", id, timeframe, targetCurrency];

  return useQuery<OHLCData[], Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!id) return [];

      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

      if (useMockData) {
        // console.warn(
        //   "[React Query] Mock data requested for historical OHLC, but generator not implemented. Returning empty."
        // );
        return [];
      }

      // console.log(
      //   `[React Query] Fetching live history (OHLC) for queryKey: ${JSON.stringify(queryKey)}`,
      // );

      const symbolsMap = mapCoinIdsToSymbols([id]);
      const symbol = symbolsMap[id]?.toUpperCase();

      if (!symbol) return [];

      const limit = timeframeToDays(timeframe);

      const apiResponse = await fetchCryptoCompareHistory(
        symbol,
        targetCurrency,
        limit,
      );

      if (!apiResponse || !apiResponse.Data?.Data) {
        // console.warn(
        //   `Failed to fetch or parse history for ${id} (${symbol}) from API.`,
        // );
        return [];
      }

      const transformedData = transformHistoryToOHLC(apiResponse.Data.Data);
      return transformedData;
    },
    enabled: options.enabled && !!id,
    staleTime: 1000 * 60 * 15,
    // Keep previous data while fetching new timeframe? `keepPreviousData: true`
  });
}

/**
 * Hook to fetch the list of available cryptocurrencies, combining data from CoinDesk/Messari
 * and image URLs from CryptoCompare.
 */
export function useCryptoList() {
  const coinListQuery = useQuery<CryptoCompareCoinListResponse | null, Error>({
    queryKey: [CRYPTO_COMPARE_COIN_LIST_QUERY_KEY],
    queryFn: fetchCryptoCompareCoinList,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "true",
    refetchOnWindowFocus: false,
  });

  // Fetch CoinDesk list (consider if this needs its own query if reusable)
  const topListQuery = useQuery<CoinDeskAsset[], Error>({
    queryKey: [COIN_DESK_TOP_LIST_QUERY_KEY], // Use constant
    // Fetches a list of top assets (by rank) from CoinDesk/Messari.
    // This provides the primary ID (slug), symbol, name, rank, and price.
    queryFn: async () => {
      const topList = await fetchCoinDeskTopList();
      return topList?.data ?? [];
    },
    staleTime: 1000 * 60 * 10, // Cache CoinDesk list for 10 minutes
    enabled: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "true", // Only fetch if not using mock data
  });

  // Combine data when both queries succeed
  const combinedDataQuery = useQuery<CryptoSearchResult[], Error>({
    queryKey: [
      CRYPTO_LIST_COMBINED_QUERY_KEY,
      coinListQuery.data,
      topListQuery.data,
    ], // Use constant
    /**
     * Combines the results from CryptoCompare (for images) and CoinDesk (for rank, price, ID).
     * Strategy:
     * 1. Use the CoinDesk list as the primary source, sorted by market cap rank.
     * 2. For each asset in the CoinDesk list, try to find matching info in the CryptoCompare list using the *symbol*.
     * 3. Extract the image URL from the CryptoCompare data (using the BaseImageUrl).
     * 4. Extract the ID (slug), name (prefer CryptoCompare's CoinName if available, else CoinDesk slug),
     *    symbol, rank, and price from the CoinDesk data.
     * 5. If CryptoCompare data is unavailable, it falls back to only using CoinDesk data (without images).
     * 6. Returns the combined list, limited to the top 150 assets.
     */
    queryFn: () => {
      // console.log("[Combined Query] Calculating combined list...");
      const coinListData = coinListQuery.data;
      const topListData = topListQuery.data ?? []; // Default to empty array

      console.log("[Combined Query] CoinListData:", coinListQuery);
      console.log("[Combined Query] TopListData:", topListData);

      if (!coinListData || !coinListData.Data) {
        console.warn(
          "[Combined Query] CryptoCompare coin list data invalid. Reason:",
          {
            hasCoinListData: !!coinListData,
            hasDataProp: !!coinListData?.Data,
          },
          "Returning processed CoinDesk data only.",
        );
        // Process CoinDesk data as fallback without images/prices
        const fallbackResults = topListData
          .filter(
            (asset): asset is RankedAssetWithSlug =>
              typeof asset.slug === "string" &&
              asset.slug.length > 0 &&
              typeof asset.metrics?.marketcap?.rank === "number",
          )
          .sort((a, b) => a.metrics.marketcap.rank - b.metrics.marketcap.rank)
          .map((asset) => ({
            id: asset.slug,
            name: asset.slug, // Use slug as name if CoinName isn't available
            symbol: asset.symbol,
            marketCapRank: asset.metrics.marketcap.rank,
            priceUsd: asset.metrics?.market_data?.price_usd,
            image: undefined, // No image URL available
          }));
        return fallbackResults.slice(0, 150);
      }

      // --- Start Combining Logic ---
      const cryptoCompareMap = coinListData.Data;

      // Define RankedAssetWithSlug again or import if moved to types
      interface RankedAssetWithSlug
        extends Omit<CoinDeskAsset, "metrics" | "slug"> {
        slug: string;
        metrics: {
          marketcap: { rank: number };
          market_data?: { price_usd?: number };
        };
      }

      const validAssets = topListData.filter(
        (asset): asset is RankedAssetWithSlug =>
          typeof asset.slug === "string" &&
          asset.slug.length > 0 &&
          typeof asset.metrics?.marketcap?.rank === "number",
      );

      const sortedList = [...validAssets].sort(
        (a, b) => a.metrics.marketcap.rank - b.metrics.marketcap.rank,
      );

      console.log("[Combined Query] Sorted list:", sortedList);

      const results: CryptoSearchResult[] = sortedList.map((asset) => {
        const ccInfo = cryptoCompareMap[asset.symbol];
        const imageUrl = ccInfo?.ImageUrl
          ? `https://www.cryptocompare.com${ccInfo.ImageUrl}`
          : undefined;

        const displayName = ccInfo?.CoinName || asset.slug;

        // Assemble the final search result object.
        return {
          id: asset.slug, // Use CoinDesk slug as the primary ID.
          name: displayName,
          symbol: asset.symbol,
          marketCapRank: asset.metrics.marketcap.rank,
          priceUsd: asset.metrics?.market_data?.price_usd, // Get price from CoinDesk.
          image: imageUrl, // Get image URL from CryptoCompare.
        };
      });

      // console.log(
      //   `[Combined Query] Successfully combined ${results.length} assets.`,
      // );
      return results.slice(0, 150);
    },
    enabled:
      process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "true" &&
      coinListQuery.isSuccess &&
      topListQuery.isSuccess,
    staleTime: 1000 * 60 * 5,
  });

  // Handle mock data separately
  const mockDataQuery = useQuery<CryptoSearchResult[], Error>({
    queryKey: [CRYPTO_LIST_MOCK_QUERY_KEY],
    queryFn: async () => {
      // console.log("[Mock Query] Generating mock crypto list...");
      // Add mock data generation logic here if needed, otherwise return empty
      return [];
    },
    enabled: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
    staleTime: Number.POSITIVE_INFINITY,
  });

  // Determine which query result to return
  const queryToReturn =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
      ? mockDataQuery
      : combinedDataQuery;

  return {
    ...queryToReturn,
    // Explicitly expose loading/error states based on the underlying queries when not using mock data
    isLoading:
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
        ? mockDataQuery.isLoading
        : coinListQuery.isLoading ||
          topListQuery.isLoading ||
          combinedDataQuery.isLoading,
    isError:
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
        ? mockDataQuery.isError
        : coinListQuery.isError ||
          topListQuery.isError ||
          combinedDataQuery.isError,
    error:
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
        ? mockDataQuery.error
        : coinListQuery.error || topListQuery.error || combinedDataQuery.error,
  };
}

// --- Zustand Store Interaction Hooks (Mutations) ---

/**
 * Hook to add a new crypto holding to the portfolio.
 * The input data should contain the necessary fields excluding the generated `id`.
 */
export function useAddHoldingMutation() {
  const { addHolding } = usePortfolioStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newHoldingData: {
      apiId: string;
      name: string;
      symbol: string;
      quantity: number;
      purchasePrice: number;
      image?: string;
      purchaseDate?: string;
    }) => {
      const holdingToAdd: CryptoHolding = {
        id: newHoldingData.apiId,
        name: newHoldingData.name,
        symbol: newHoldingData.symbol,
        quantity: newHoldingData.quantity,
        purchasePrice: newHoldingData.purchasePrice,
        image: newHoldingData.image,
        purchaseDate: newHoldingData.purchaseDate || new Date().toISOString(),
        currentPrice: 0,
      };
      addHolding(holdingToAdd);
      return holdingToAdd;
    },
    onSuccess: (addedHolding) => {
      queryClient.invalidateQueries({
        queryKey: [CRYPTO_PRICES_QUERY_KEY],
      });
      // console.log("Holding added successfully:", addedHolding);
    },
    onError: (error) => {
      // console.error("Error adding holding:", error);
    },
  });
}

/**
 * Hook to update an existing crypto holding in the portfolio.
 */
export function useUpdateHoldingMutation() {
  const { updateHolding } = usePortfolioStore();
  const queryClient = useQueryClient();

  // Define a type for the mutation input that includes optional apiId
  type UpdateHoldingInput = {
    id: string;
    updates: Partial<Omit<CryptoHolding, "id">> & { apiId?: string }; // Allow optional apiId
  };

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateHoldingInput) => {
      // Destructure apiId safely, it might not be present
      const { apiId, ...restUpdates } = updates;
      updateHolding(id, restUpdates);
      return { id, updates: restUpdates };
    },
    onSuccess: (result) => {
      // console.log(`Holding ${result.id} updated successfully:`, result.updates);
      queryClient.invalidateQueries({ queryKey: [CRYPTO_PRICES_QUERY_KEY] });
    },
    onError: (error) => {
      // console.error("Error updating holding:", error);
    },
  });
}

/**
 * Hook providing a mutation function to delete a holding from the Zustand store.
 */
function useDeleteHoldingMutation() {
  const queryClient = useQueryClient();
  const removeHolding = usePortfolioStore((state) => state.removeHolding);

  return useMutation({
    mutationFn: async (holdingId: string) => {
      removeHolding(holdingId); // Update Zustand store
      return holdingId; // Return the ID of the deleted holding
    },
    onSuccess: (deletedHoldingId) => {
      // console.log("Holding deleted successfully:", deletedHoldingId);
      // Invalidate price queries as total value might change
      queryClient.invalidateQueries({ queryKey: [CRYPTO_PRICES_QUERY_KEY] });
    },
    onError: (error) => {
      // console.error("Error deleting holding:", error);
    },
  });
}
