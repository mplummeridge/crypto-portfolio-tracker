import type { CoinDeskApiResponse } from "@/types/api/coindesk";

const API_BASE_URL = "https://data.messari.io/api/v1/assets";

/**
 * Fetches the top list of crypto assets from CoinDesk (Messari) API.
 *
 * @returns A promise resolving to the CoinDesk API response containing asset data.
 * @throws Throws an error if the fetch operation fails or the response is invalid.
 */
export async function fetchCoinDeskTopList(): Promise<CoinDeskApiResponse | null> {
  const url = `${API_BASE_URL}?fields=id,slug,symbol,metrics/market_data/price_usd,metrics/marketcap/rank`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`,
      );
    }

    const data: CoinDeskApiResponse = await response.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid API response structure received from CoinDesk.");
    }

    return data;
  } catch (error) {
    return null;
  }
}
