import type { HistoricalData, OHLCData } from "@/app/api/crypto/types";
import type { Timeframe } from "@/hooks/useCryptoData";
import type { CryptoComparePriceData } from "@/types/api/cryptocompare";
import type {
  CryptoCurrency,
  CryptoDetails,
  CryptoSearchResult,
} from "@/types/crypto";
import type { GlobalMarketData } from "@/types/global";
import { MOCK_CRYPTOS } from "./mock-data";

/**
 * Simulates network delay.
 * @param ms - Milliseconds to delay.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates mock prices for a list of crypto IDs.
 * @param ids - Array of crypto IDs (e.g., ["bitcoin", "ethereum"])
 * @param targetCurrency - Target currency (currently unused in mock, assumes USD)
 * @returns A Record mapping ID to a mock price.
 */
export async function generateMockPrices(
  ids: string[],
  targetCurrency = "USD",
): Promise<Record<string, CryptoComparePriceData>> {
  await delay(200);

  const mockData: Record<string, CryptoComparePriceData> = {};
  for (const id of ids) {
    const crypto = MOCK_CRYPTOS.find((c) => c.id === id);
    const mockPrice = crypto ? crypto.currentPrice : Math.random() * 500 + 1;
    const mockSymbol = crypto
      ? crypto.symbol.toUpperCase()
      : id.substring(0, 3).toUpperCase();

    mockData[id] = {
      TYPE: "5",
      MARKET: "MockMarket",
      FROMSYMBOL: mockSymbol,
      TOSYMBOL: targetCurrency.toUpperCase(),
      FLAGS: "0",
      LASTMARKET: "MockMarket",
      PRICE: mockPrice,
      LASTUPDATE: Math.floor(Date.now() / 1000),
      VOLUME24HOUR: Math.random() * 10000,
      VOLUME24HOURTO: Math.random() * 10000 * mockPrice,
      CHANGEPCT24HOUR: Math.random() * 10 - 5,
      CONVERSIONTYPE: "direct",
      CONVERSIONSYMBOL: "",
    };
  }
  return mockData;
}

/**
 * Generates mock detailed information for a single crypto ID.
 * @param id - The crypto ID (e.g., "bitcoin")
 * @returns Mock CryptoDetails object or null if not found.
 */
async function generateMockDetails(
  id: string,
): Promise<Partial<CryptoDetails> | null> {
  await delay(300);

  const crypto = MOCK_CRYPTOS.find((c: CryptoCurrency) => c.id === id);
  if (!crypto) {
    return null;
  }

  return {
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    image: crypto.image,
    market_data: {
      current_price: { usd: crypto.currentPrice },
      market_cap: {
        usd: crypto.currentPrice * (Math.random() * 200000 + 100000),
      },
      price_change_percentage_24h: Math.random() * 10 - 5,
      price_change_percentage_7d: Math.random() * 20 - 10,
      total_volume: {
        usd: crypto.currentPrice * (Math.random() * 50000 + 10000),
      },
    },
    description: {
      en: `This is a mock description for ${crypto.name} (${crypto.symbol}). It includes details about its origins, technology, and market performance. Use this data for development and testing purposes only.`,
    },
    market_cap_rank: MOCK_CRYPTOS.findIndex((c) => c.id === id) + 1,
    links: {
      homepage: [`https://mock-homepage.com/${crypto.id}`],
      blockchain_site: [`https://mock-explorer.com/${crypto.symbol}`],
      subreddit_url: `https://reddit.com/r/${crypto.id}`,
    },
  };
}

export function timeframeToDays(timeframe: Timeframe): number {
  switch (timeframe) {
    case "1d":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "1y":
      return 365;
    case "max":
      return 1825;
    default:
      return 30;
  }
}
