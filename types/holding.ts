export interface BaseHolding {
  id: string;
  quantity: number;
}

export interface InitialHolding extends BaseHolding {
  name: string;
  symbol: string;
  image?: string;
}

export interface CryptoHolding extends BaseHolding {
  name: string;
  symbol: string;
  purchasePrice: number;
  purchaseDate?: string;
  currentPrice: number;
  image?: string;
  changePct24h?: number;
  changeAbs24h?: number;
  marketCap?: number;
  volume24h?: number;
}
