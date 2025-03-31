import type {
  CryptoCompareApiResponse,
  CryptoCompareCoinInfo,
  CryptoCompareCoinListResponse,
  CryptoCompareHistoryApiResponse,
  CryptoCompareMultiPriceResponse,
  MarketDataApiResponse,
} from "@/types/api/cryptocompare";

const CRYPTOCOMPARE_API_BASE = "https://min-api.cryptocompare.com/data";

/**
 * Fetches current prices for multiple cryptocurrencies from CryptoCompare.
 * @param symbols - Array of uppercase cryptocurrency symbols (e.g., ['BTC', 'ETH']).
 * @param targetCurrencies - Array of uppercase target currency symbols (e.g., ['USD', 'EUR']).
 * @returns A promise resolving to the price data or null if the fetch fails.
 * @throws Throws an error if the network response is not ok.
 */
async function fetchCryptoComparePrices(
  symbols: string[],
  targetCurrencies: string[],
): Promise<CryptoCompareMultiPriceResponse | null> {
  if (
    !symbols ||
    symbols.length === 0 ||
    !targetCurrencies ||
    targetCurrencies.length === 0
  ) {
    return null;
  }

  const fromSymbols = symbols.join(",");
  const toSymbols = targetCurrencies.join(",");
  let url = `${CRYPTOCOMPARE_API_BASE}/pricemulti?fsyms=${fromSymbols}&tsyms=${toSymbols}`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;
    if (apiKey) {
      url += `&api_key=${apiKey}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CryptoCompareMultiPriceResponse = await response.json();

    if (typeof data !== "object" || data === null) {
      throw new Error(
        "Invalid response structure received from CryptoCompare pricemulti.",
      );
    }

    if (symbols.length > 0 && Object.keys(data).length === 0) {
    }

    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches full current data (including market stats) for multiple cryptocurrencies from CryptoCompare.
 * Uses the /pricemultifull endpoint.
 * @param symbols - Array of uppercase cryptocurrency symbols (e.g., ['BTC', 'ETH']).
 * @param targetCurrencies - Array of uppercase target currency symbols (e.g., ['USD', 'EUR']).
 * @returns A promise resolving to the full price data (CryptoCompareApiResponse) or null if the fetch fails.
 * @throws Throws an error if the network response is not ok or the response structure is invalid.
 */
export async function fetchCryptoComparePricesFull(
  symbols: string[],
  targetCurrencies: string[],
): Promise<CryptoCompareApiResponse | null> {
  if (
    !symbols ||
    symbols.length === 0 ||
    !targetCurrencies ||
    targetCurrencies.length === 0
  ) {
    return null;
  }

  const fromSymbols = symbols.join(",");
  const toSymbols = targetCurrencies.join(",");
  let url = `${CRYPTOCOMPARE_API_BASE}/pricemultifull?fsyms=${fromSymbols}&tsyms=${toSymbols}`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;
    if (apiKey) {
      url += `&api_key=${apiKey}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CryptoCompareApiResponse = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      !data.RAW ||
      !data.DISPLAY
    ) {
      throw new Error(
        "Invalid response structure received from CryptoCompare pricemultifull.",
      );
    }

    return data;
  } catch (error) {
    return null;
  }
}

// --- CoinDesk/CryptoCompare Metadata Client ---

const ASSET_DATA_API_BASE =
  process.env.NEXT_PUBLIC_ASSET_DATA_API_BASE ||
  "https://data-api.cryptocompare.com/asset/v1";

/**
 * Fetches market data and potentially metadata for a single symbol.
 * Tries using the /asset/v1/data/by/symbol endpoint.
 * @param symbol - The uppercase cryptocurrency symbol (e.g., "BTC").
 * @returns A promise resolving to the parsed API response or null if fetch fails.
 */
export async function fetchMarketDataBySymbol(
  symbol: string,
): Promise<MarketDataApiResponse | null> {
  if (!symbol) {
    return null;
  }

  const upperSymbol = symbol.toUpperCase();
  const url = `${ASSET_DATA_API_BASE}/data/by/symbol?asset_symbol=${upperSymbol}`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;

    const requestOptions: RequestInit = {};
    if (apiKey) {
      requestOptions.headers = { Authorization: `Apikey ${apiKey}` };
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      return null;
    }

    const data: MarketDataApiResponse = await response.json();

    if (
      !data ||
      typeof data !== "object" ||
      !data.Data ||
      typeof data.Data !== "object"
    ) {
      return null;
    }

    if (data.Err && Object.keys(data.Err).length > 0) {
      return null;
    }

    return data as MarketDataApiResponse;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches daily historical price data for a single symbol from CryptoCompare.
 * Uses the /data/v2/histoday endpoint.
 * @param symbol - The uppercase cryptocurrency symbol (e.g., "BTC").
 * @param targetCurrency - The uppercase target currency symbol (e.g., "USD").
 * @param limit - The number of data points to return (days).
 * @returns A promise resolving to the historical data or null if fetch fails.
 * @throws Throws an error if the network response is not ok or the response structure is invalid.
 */
export async function fetchCryptoCompareHistory(
  symbol: string,
  targetCurrency: string,
  limit = 30,
  aggregate = 1,
): Promise<CryptoCompareHistoryApiResponse | null> {
  if (!symbol || !targetCurrency) {
    return null;
  }

  const upperSymbol = symbol.toUpperCase();
  const upperTargetCurrency = targetCurrency.toUpperCase();
  let url = `${CRYPTOCOMPARE_API_BASE}/v2/histoday?fsym=${upperSymbol}&tsym=${upperTargetCurrency}&limit=${limit}&aggregate=${aggregate}`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;
    if (apiKey) {
      url += `&api_key=${apiKey}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CryptoCompareHistoryApiResponse = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      data.Response !== "Success" ||
      !data.Data ||
      !data.Data.Data ||
      !Array.isArray(data.Data.Data)
    ) {
      if (data.Response !== "Success") {
        throw new Error(
          `CryptoCompare histoday API returned error: ${data.Message}`,
        );
      }
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches the complete list of coins from CryptoCompare.
 * Provides information including image paths.
 * Uses the /all/coinlist endpoint.
 * @returns A promise resolving to the coin list data or null if fetch fails.
 * @throws Throws an error if the network response is not ok or the response structure is invalid.
 */
export async function fetchCryptoCompareCoinList(): Promise<CryptoCompareCoinListResponse | null> {
  let url = `${CRYPTOCOMPARE_API_BASE}/all/coinlist`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;
    if (apiKey) {
      url += `?api_key=${apiKey}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CryptoCompareCoinListResponse = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      !data.Data ||
      typeof data.Data !== "object" ||
      data.Response !== "Success"
    ) {
      if (data.Response !== "Success") {
        throw new Error(`CryptoCompare coinlist API error: ${data.Message}`);
      }
      throw new Error(
        "CryptoCompare coinlist API success response but invalid structure (Missing Data).",
      );
    }

    if (!data.BaseLinkUrl) {
      data.BaseLinkUrl = "https://www.cryptocompare.com";
    }

    return data;
  } catch (error) {
    return null;
  }
}
