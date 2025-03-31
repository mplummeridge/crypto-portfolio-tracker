export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  image?: string;
  marketCapRank?: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
  marketCap?: number;
  totalVolume?: number;
  high24h?: number;
  low24h?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  ath?: number;
  athChangePercentage?: number;
  athDate?: string;
  atl?: number;
  atlChangePercentage?: number;
  atlDate?: string;
  lastUpdated?: string;
}

export interface CryptoDetails extends CryptoCurrency {
  description?: { en?: string };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
    subreddit_url?: string;
    twitter_screen_name?: string;
    repos_url?: {
      github?: string[];
      bitbucket?: string[];
    };
  };
  market_data?: {
    current_price?: { [currency: string]: number };
    market_cap?: { [currency: string]: number };
    total_volume?: { [currency: string]: number };
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    circulating_supply?: number;
    ath?: { [currency: string]: number };
    ath_change_percentage?: { [currency: string]: number };
    atl?: { [currency: string]: number };
    atl_change_percentage?: { [currency: string]: number };
  };
  genesis_date?: string | null;
  sentiment_votes_up_percentage?: number;
  sentiment_votes_down_percentage?: number;
  watchlist_portfolio_users?: number;
  market_cap_rank?: number;
  hashing_algorithm?: string | null;
  categories?: string[];
  last_updated?: string;

  // Fields added by our mock API
  dataAccuracy?: "limited" | "full";
  isRateLimited?: boolean;
  __source?: "api" | "cache" | "fallback";
}

interface CryptoHistoricalData {
  date: string;
  price: number;
  volume: number;
  priceChange: number;
}

type HistoricalData = CryptoHistoricalData;

interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CryptoSearchResult {
  id: string;
  name: string;
  symbol: string;
  marketCapRank?: number;
  priceUsd?: number;
  image?: string;
}

// ExtendedCryptoDetails combines CryptoDetails with fields from specific APIs (like CryptoCompare's asset data)
export interface ExtendedCryptoDetails extends CryptoDetails {
  SUPPORTED_PLATFORMS?: Array<{
    BLOCKCHAIN: string;
    BLOCKCHAIN_ASSET_ID?: number | string;
    TOKEN_STANDARD?: string;
    EXPLORER_URL?: string;
    SMART_CONTRACT_ADDRESS?: string;
    LAUNCH_DATE?: number;
    TRADING_AS?: string;
    DECIMALS?: number;
    IS_INHERITED?: boolean;
  }>;
  RESERVES_BREAKDOWN?: Array<{
    RESERVE_TYPE: string;
    PERCENTAGE: number;
    DESCRIPTION?: string;
  }>;
  ASSET_TYPE?: string;
  ASSET_ISSUER_NAME?: string;
  ASSET_INDUSTRIES?: Array<{ ASSET_INDUSTRY: string; JUSTIFICATION?: string }>;
  SUPPLY_TOTAL?: number;
  SUPPLY_LOCKED?: number;
  SUPPLY_BURNT?: number;
  SUPPLY_STAKED?: number;
  ASSET_SECURITY_METRICS?: Array<{
    NAME: string;
    OVERALL_SCORE?: number;
    OVERALL_RANK?: number;
    UPDATED_AT?: number;
  }>;
  ASSET_CUSTODIANS?: Array<{ NAME: string }>;
  ASSET_ALTERNATIVE_IDS?: Array<{ NAME: string; ID: string }>;
  TOPLIST_BASE_RANK?: Record<string, number>;
  ASSET_DESCRIPTION?: string;
  ASSET_DESCRIPTION_SNIPPET?: string;
  WHITE_PAPER_URL?: string;
  OTHER_DOCUMENT_URLS?: Array<{ TYPE: string; URL: string }>;
  OTHER_SOCIAL_NETWORKS?: Array<{ NAME: string; URL: string }>;
  CODE_REPOSITORIES?: Array<{
    URL: string;
    MAKE_3RD_PARTY_REQUEST?: boolean;
    OPEN_ISSUES?: number;
    CLOSED_ISSUES?: number;
    OPEN_PULL_REQUESTS?: number;
    CLOSED_PULL_REQUESTS?: number;
    CONTRIBUTORS?: number;
    FORKS?: number;
    STARS?: number;
    SUBSCRIBERS?: number;
    LAST_UPDATED_TS?: number;
    CREATED_AT?: number;
    UPDATED_AT?: number;
    LAST_PUSH_TS?: number;
    CODE_SIZE_IN_BYTES?: number;
    IS_FORK?: boolean;
    LANGUAGE?: string | null;
  }>;
  SUBREDDITS?: Array<{
    URL: string;
    MAKE_3RD_PARTY_REQUEST?: boolean;
    NAME?: string;
    CURRENT_ACTIVE_USERS?: number;
    AVERAGE_POSTS_PER_DAY?: number;
    AVERAGE_POSTS_PER_HOUR?: number;
    AVERAGE_COMMENTS_PER_DAY?: number;
    AVERAGE_COMMENTS_PER_HOUR?: number;
    SUBSCRIBERS?: number;
    COMMUNITY_CREATED_AT?: number;
    LAST_UPDATED_TS?: number;
  }>;
  TWITTER_ACCOUNTS?: Array<{
    URL: string;
    NAME?: string;
    USERNAME?: string;
    FOLLOWING?: number;
    FOLLOWERS?: number;
    FAVOURITES?: number;
    LISTS?: number;
    STATUSES?: number;
    ACCOUNT_CREATED_AT?: number;
    LAST_UPDATED_TS?: number;
  }>;
  TELEGRAM_GROUPS?: Array<{
    URL: string;
    MAKE_3RD_PARTY_REQUEST?: boolean;
    NAME?: string;
    USERNAME?: string;
    MEMBERS?: number;
    LAST_UPDATED_TS?: number;
  }>;
  PROJECT_LEADERS?: Array<{
    LEADER_TYPE: string;
    FULL_NAME: string;
  }>;
  ASSET_SYMBOL_GLYPH?: string;
  HASHING_ALGORITHM?: string | null;
  ASSET_DESCRIPTION_SUMMARY?: string;
  SUPPLY_ISSUED?: number;
}
