export interface CoinDeskAsset {
  id: string;
  slug?: string;
  symbol: string;
  metrics?: {
    market_data?: {
      price_usd?: number;
    };
    marketcap?: {
      rank?: number;
    };
  };
  image?: string;
}

export interface CoinDeskApiResponse {
  status: {
    elapsed: number;
    timestamp: string;
  };
  data: CoinDeskAsset[];
}
