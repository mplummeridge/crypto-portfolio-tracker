import { fetchCryptoComparePricesFull } from "@/lib/api-clients";
import { mapCoinIdToSymbol, mapCoinIdsToSymbols } from "@/lib/utils";
import type {
  AssetData,
  CryptoComparePriceData,
} from "@/types/api/cryptocompare";
import type { ExtendedCryptoDetails } from "@/types/crypto";
import type { CryptoCurrency } from "@/types/crypto";

const API_KEY = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;

// Helper function to safely convert timestamp to ISO string
const safeTimestampToISO = (
  timestamp: number | undefined | null,
): string | undefined => {
  if (typeof timestamp === "number" && timestamp > 0) {
    try {
      return new Date(timestamp * 1000).toISOString();
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
};

/**
 * Fetches detailed cryptocurrency data from the CryptoCompare API for a given coin ID.
 * Uses Next.js fetch extension for caching.
 * IMPORTANT: This function is designed for SERVER-SIDE use only.
 *
 * @param coinId - The base ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum'). Case-insensitive.
 * @returns A promise that resolves to the ExtendedCryptoDetails or null if not found/error.
 * @throws Throws an error if the fetch operation fails critically.
 */
export async function fetchCryptoDetails(
  coinId: string,
): Promise<ExtendedCryptoDetails | null> {
  if (!coinId) {
    return null;
  }
  if (!API_KEY) {
    // Proceed, but be aware of potential rate limits or failures
  }

  const symbol = mapCoinIdToSymbol(coinId);

  if (!symbol) {
    return null;
  }

  // Use the /asset/v1 endpoint
  const url = `${process.env.NEXT_PUBLIC_CRYPTOCOMPARE_ASSET_API_URL || "https://data-api.cryptocompare.com/asset/v1"}/data/by/symbol?asset_symbol=${symbol}`;

  try {
    const requestOptions: RequestInit = {
      next: { revalidate: 300 }, // Cache for 5 minutes
    };
    if (API_KEY) {
      requestOptions.headers = {
        Authorization: `Apikey ${API_KEY}`,
        Accept: "application/json",
      };
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorBodyText = await response.text();
      // Log to monitoring service here instead
      if (response.status === 404 || response.status === 400) return null;
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const rawApiResponse: {
      Data?: AssetData;
      Response?: string;
      Message?: string;
    } = await response.json();

    if (rawApiResponse?.Data && typeof rawApiResponse.Data === "object") {
      const assetData: AssetData = rawApiResponse.Data;

      const details: ExtendedCryptoDetails = {
        // ** Core Identification **
        id: coinId,
        symbol: assetData.SYMBOL || symbol,
        name: assetData.NAME || symbol,
        image: assetData.LOGO_URL,
        currentPrice: assetData.PRICE_USD ?? 0,
        market_cap_rank: assetData.TOPLIST_BASE_RANK?.CIRCULATING_MKT_CAP_USD,

        // ** General Info **
        genesis_date: safeTimestampToISO(assetData.LAUNCH_DATE),
        hashing_algorithm: assetData.HASHING_ALGORITHM,

        // ** Market Data **
        market_data: {
          current_price: { usd: assetData.PRICE_USD ?? 0 },
          market_cap: { usd: assetData.CIRCULATING_MKT_CAP_USD ?? 0 },
          total_volume: {
            usd: assetData.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD ?? 0,
          },
          price_change_percentage_24h:
            assetData.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD,
          price_change_percentage_7d:
            assetData.SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD,
          price_change_percentage_30d:
            assetData.SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD,
          circulating_supply: assetData.SUPPLY_CIRCULATING,
        },

        // ** Links **
        links: {
          homepage: assetData.WEBSITE_URL ? [assetData.WEBSITE_URL] : [],
          blockchain_site: (assetData.SUPPORTED_PLATFORMS ?? [])
            .map((ex: { EXPLORER_URL?: string }) => ex.EXPLORER_URL)
            .filter((url): url is string => !!url),
          official_forum_url: [],
          repos_url: {
            github:
              assetData.CODE_REPOSITORIES?.filter((repo: { URL?: string }) =>
                repo.URL?.includes("github.com"),
              ).map((repo: { URL: string }) => repo.URL) || [],
            bitbucket: [],
          },
          subreddit_url: assetData.SUBREDDITS?.[0]?.URL,
          twitter_screen_name: assetData.TWITTER_ACCOUNTS?.[0]?.USERNAME,
        },

        // ** Extended fields **
        ASSET_DESCRIPTION_SUMMARY:
          assetData.ASSET_DESCRIPTION_SUMMARY ||
          assetData.ASSET_DESCRIPTION_SNIPPET,
        SUPPORTED_PLATFORMS: assetData.SUPPORTED_PLATFORMS || [],
        RESERVES_BREAKDOWN:
          assetData.RESERVES_BREAKDOWN?.map((r) => ({
            RESERVE_TYPE: r.RESERVE_TYPE,
            PERCENTAGE: r.PERCENTAGE,
            DESCRIPTION: r.DESCRIPTION,
          })) || [],
        SUPPLY_TOTAL: assetData.SUPPLY_TOTAL,
        SUPPLY_ISSUED: assetData.SUPPLY_ISSUED,
        SUPPLY_LOCKED: assetData.SUPPLY_LOCKED,
        TOPLIST_BASE_RANK: assetData.TOPLIST_BASE_RANK,
        ASSET_ISSUER_NAME: assetData.ASSET_ISSUER_NAME,
        ASSET_SECURITY_METRICS: assetData.ASSET_SECURITY_METRICS || [],
        ASSET_TYPE: assetData.ASSET_TYPE,
        ASSET_INDUSTRIES: assetData.ASSET_INDUSTRIES || [],
        ASSET_CUSTODIANS: assetData.ASSET_CUSTODIANS || [],
        WHITE_PAPER_URL: assetData.WHITE_PAPER_URL,
        OTHER_DOCUMENT_URLS: assetData.OTHER_DOCUMENT_URLS || [],
        ASSET_ALTERNATIVE_IDS: assetData.ASSET_ALTERNATIVE_IDS || [],
        OTHER_SOCIAL_NETWORKS: assetData.OTHER_SOCIAL_NETWORKS || [],
      };
      return details;
    }
    if (rawApiResponse?.Response === "Error") {
      // Log to monitoring service
      return null;
    }
    // Log unexpected structure to monitoring service
    return null;
  } catch (error) {
    // Log unexpected error to monitoring service
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`An unknown error occurred while fetching ${symbol}`);
  }
}

/**
 * Fetches bulk price and basic market data for multiple cryptocurrencies using their IDs.
 * Designed for server-side use, especially for initial data loading.
 * Leverages the /pricemultifull endpoint via fetchCryptoComparePricesFull.
 * Includes server-side caching via the underlying fetch call in fetchCryptoComparePricesFull.
 *
 * @param coinIds - An array of coin IDs (e.g., ["bitcoin", "ethereum"]). Case-insensitive.
 * @param targetCurrency - The target currency symbol (e.g., "USD"). Defaults to "USD".
 * @returns A promise resolving to a record mapping each original coinId to its price data
 *          (CryptoComparePriceData) or null if the ID couldn't be mapped or data wasn't found.
 * @throws Throws errors from the underlying fetch call if critical network issues occur.
 */
export async function fetchCryptoPricesBulk(
  coinIds: string[],
  targetCurrency = "USD",
): Promise<Record<string, CryptoComparePriceData | null>> {
  const initialResult: Record<string, CryptoComparePriceData | null> = {};
  if (!coinIds || coinIds.length === 0) {
    return initialResult; // Return empty object if no IDs
  }

  // Initialize result with null for all requested IDs
  for (const id of coinIds) {
    initialResult[id] = null;
  }

  const idToSymbolMap = new Map<string, string | null>();
  const symbolToIdMap = new Map<string, string>();
  const symbolsToFetch: string[] = [];

  for (const id of coinIds) {
    const symbol = mapCoinIdToSymbol(id);
    idToSymbolMap.set(id, symbol);
    if (symbol) {
      symbolsToFetch.push(symbol);
      symbolToIdMap.set(symbol, id);
    } else {
      // ID will remain null in the result
    }
  }

  if (symbolsToFetch.length === 0) {
    return initialResult; // Return object with all nulls if no symbols mapped
  }

  try {
    const bulkData = await fetchCryptoComparePricesFull(symbolsToFetch, [
      targetCurrency,
    ]);

    if (bulkData?.RAW) {
      const target = targetCurrency.toUpperCase();
      for (const [symbol, currencyDataUntyped] of Object.entries(
        bulkData.RAW,
      )) {
        const currencyData = currencyDataUntyped as Record<
          string,
          CryptoComparePriceData
        >;
        const priceData = currencyData?.[target];
        if (priceData) {
          const originalId = symbolToIdMap.get(symbol);
          if (originalId) {
            initialResult[originalId] = priceData;
          } else {
            // This case should theoretically not happen if symbolToIdMap is correct
          }
        } else {
          // Keep result[originalId] as null
        }
      }
    } else {
      // Result already initialized with nulls, so no need to change it here.
    }
  } catch (error) {
    // Log error to monitoring service
    return initialResult;
  }

  return initialResult;
}
