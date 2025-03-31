import type { z } from "zod";
import type {
  CryptoCurrencySchema,
  SearchResultSchema,
} from "../../app/api/crypto/types";

export const mockCryptoData = {
  searchResults: [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
      market_cap_rank: 1,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
      market_cap_rank: 2,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      thumb: "https://assets.coingecko.com/coins/images/975/thumb/cardano.png",
      market_cap_rank: 3,
    },
  ] satisfies z.infer<typeof SearchResultSchema>[],

  prices: {
    bitcoin: {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      currentPrice: 50000,
      marketCap: 1000000000000,
      marketCapRank: 1,
      totalVolume: 50000000000,
      priceChangePercentage24h: 2,
      circulatingSupply: 19000000,
      totalSupply: 21000000,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    },
  } satisfies Record<string, z.infer<typeof CryptoCurrencySchema>>,
};
