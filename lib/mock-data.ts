import type { CryptoCurrency } from "@/types/crypto";
import type { CryptoHolding } from "@/types/holding";

interface GlobalMarketData {
  totalMarketCap: number;
  totalVolume: number;
  marketCapChange: number;
  btcDominance: number;
  ethDominance: number;
}

// Mock cryptocurrency data - Update to match CryptoHolding from types.ts
const mockHoldings: CryptoHolding[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    quantity: 0.5,
    purchasePrice: 48000,
    currentPrice: 50000,
    purchaseDate: new Date("2023-10-01T10:00:00Z").toISOString(),
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    quantity: 4,
    purchasePrice: 2500,
    currentPrice: 3000,
    purchaseDate: new Date("2023-11-15T14:30:00Z").toISOString(),
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    quantity: 1000,
    purchasePrice: 0.45,
    currentPrice: 0.5,
    purchaseDate: new Date("2024-01-20T09:00:00Z").toISOString(),
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  },
];

// Mock global market data
const mockGlobalMarket: GlobalMarketData = {
  totalMarketCap: 2000000000000,
  totalVolume: 100000000000,
  marketCapChange: 2.5,
  btcDominance: 45,
  ethDominance: 18,
};

// Mock data (Moved from mock-api.ts)
export const MOCK_CRYPTOS: CryptoCurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    currentPrice: 50000,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    currentPrice: 4000,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: "ripple",
    name: "Ripple",
    symbol: "XRP",
    currentPrice: 1.5,
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  },
  {
    id: "litecoin",
    name: "Litecoin",
    symbol: "LTC",
    currentPrice: 200,
    image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    currentPrice: 2,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    currentPrice: 0.15,
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    currentPrice: 150,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    currentPrice: 7.5,
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    currentPrice: 83178.35424680408,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    currentPrice: 1838.8573504921383,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    currentPrice: 0.9999319452773372,
    image:
      "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
  },
  {
    id: "xrp",
    name: "Xrp",
    symbol: "XRP",
    currentPrice: 2.1776910452848344,
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  },
  {
    id: "binance-coin",
    name: "Binance Coin",
    symbol: "BNB",
    currentPrice: 609.2445698397008,
    image:
      "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    currentPrice: 125.72946562105119,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  },
  {
    id: "usd-coin",
    name: "USD Coin",
    symbol: "USDC",
    currentPrice: 1.0000881064789136,
    image: "https://assets.coingecko.com/coins/images/3408/large/usdc.png",
  },
  {
    id: "tron",
    name: "Tron",
    symbol: "TRX",
    currentPrice: 0.23181847197692898,
    image: "https://assets.coingecko.com/coins/images/1965/large/tron-logo.png",
  },
  {
    id: "the-open-network",
    name: "The Open Network",
    symbol: "TON",
    currentPrice: 3.707904797298926,
    image:
      "https://assets.coingecko.com/coins/images/17980/standard/photo_2024-09-10_17.09.00.jpeg",
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    currentPrice: 13.677234095824794,
    image:
      "https://assets.coingecko.com/coins/images/1785/large/chainlink-new-assets.png",
  },
  {
    id: "stellar",
    name: "Stellar",
    symbol: "XLM",
    currentPrice: 0.26975494197225725,
    image: "https://assets.coingecko.com/coins/images/1058/large/stellar.png",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    currentPrice: 19.71541141438947,
    image:
      "https://assets.coingecko.com/coins/images/17279/large/avalanche-2021-logo.png",
  },
];
