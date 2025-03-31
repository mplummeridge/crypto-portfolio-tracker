export interface CryptoComparePriceData {
  TYPE: string;
  MARKET: string;
  FROMSYMBOL: string;
  TOSYMBOL: string;
  FLAGS: string;
  LASTMARKET: string;
  MEDIAN?: number;
  TOPTIERVOLUME24HOUR?: number;
  TOPTIERVOLUME24HOURTO?: number;
  LASTTRADEID?: string;
  PRICE: number;
  LASTUPDATE: number; // Unix timestamp
  LASTVOLUME?: number;
  LASTVOLUMETO?: number;
  VOLUMEHOUR?: number;
  VOLUMEHOURTO?: number;
  OPENHOUR?: number;
  HIGHHOUR?: number;
  LOWHOUR?: number;
  VOLUMEDAY?: number;
  VOLUMEDAYTO?: number;
  OPENDAY?: number;
  HIGHDAY?: number;
  LOWDAY?: number;
  VOLUME24HOUR?: number;
  VOLUME24HOURTO?: number;
  OPEN24HOUR?: number;
  HIGH24HOUR?: number;
  LOW24HOUR?: number;
  CHANGE24HOUR?: number;
  CHANGEPCT24HOUR?: number;
  CHANGEDAY?: number;
  CHANGEPCTDAY?: number;
  CHANGEHOUR?: number;
  CHANGEPCTHOUR?: number;
  CONVERSIONTYPE: string;
  CONVERSIONSYMBOL: string;
  CONVERSIONLASTUPDATE?: number;
  SUPPLY?: number;
  MKTCAP?: number;
  MKTCAPPENALTY?: number;
  CIRCULATINGSUPPLY?: number;
  CIRCULATINGSUPPLYMKTCAP?: number;
  TOTALVOLUME24H?: number;
  TOTALVOLUME24HTO?: number;
  TOTALTOPTIERVOLUME24H?: number;
  TOTALTOPTIERVOLUME24HTO?: number;
  IMAGEURL?: string;
}

interface CryptoCompareDisplayPriceData {
  FROMSYMBOL: string;
  TOSYMBOL: string;
  MARKET: string;
  LASTMARKET?: string;
  TOPTIERVOLUME24HOUR?: string;
  TOPTIERVOLUME24HOURTO?: string;
  LASTTRADEID?: string;
  PRICE: string; // Display uses formatted strings
  LASTUPDATE: string;
  LASTVOLUME?: string;
  LASTVOLUMETO?: string;
  VOLUMEHOUR?: string;
  VOLUMEHOURTO?: string;
  OPENHOUR?: string;
  HIGHHOUR?: string;
  LOWHOUR?: string;
  VOLUMEDAY?: string;
  VOLUMEDAYTO?: string;
  OPENDAY?: string;
  HIGHDAY?: string;
  LOWDAY?: string;
  VOLUME24HOUR?: string;
  VOLUME24HOURTO?: string;
  OPEN24HOUR?: string;
  HIGH24HOUR?: string;
  LOW24HOUR?: string;
  CHANGE24HOUR?: string;
  CHANGEPCT24HOUR?: string;
  CHANGEDAY?: string;
  CHANGEPCTDAY?: string;
  CHANGEHOUR?: string;
  CHANGEPCTHOUR?: string;
  CONVERSIONTYPE: string;
  CONVERSIONSYMBOL: string;
  CONVERSIONLASTUPDATE?: string;
  SUPPLY?: string;
  MKTCAP?: string;
  MKTCAPPENALTY?: string; // e.g., "0 %"
  CIRCULATINGSUPPLY?: string;
  CIRCULATINGSUPPLYMKTCAP?: string;
  TOTALVOLUME24H?: string;
  TOTALVOLUME24HTO?: string;
  TOTALTOPTIERVOLUME24H?: string;
  TOTALTOPTIERVOLUME24HTO?: string;
  IMAGEURL?: string;
}

export interface CryptoCompareApiResponse {
  RAW: {
    [symbol: string]: {
      [currency: string]: CryptoComparePriceData;
    };
  };
  DISPLAY: {
    [symbol: string]: {
      [currency: string]: CryptoCompareDisplayPriceData;
    };
  };
}

export interface CryptoCompareMultiPriceResponse {
  // Dynamic keys based on requested symbols (e.g., "BTC", "ETH")
  [symbol: string]: {
    // Dynamic keys based on requested currencies (e.g., "USD", "EUR")
    [currency: string]: number;
  };
}

// Type for /data/v2/histoday, histohour, etc.
export interface CryptoCompareHistoryDataPoint {
  time: number; // Unix timestamp (seconds)
  high: number;
  low: number;
  open: number;
  close: number;
  volumefrom: number; // Volume in the base currency (e.g., BTC)
  volumeto: number; // Volume in the quote currency (e.g., USD)
  conversionType: string;
  conversionSymbol: string;
}

export interface CryptoCompareHistoryApiResponse {
  Response: string; // e.g., "Success"
  Message: string;
  HasWarning: boolean;
  Type: number;
  RateLimit: unknown; // Structure might vary
  Data: {
    Aggregated: boolean;
    TimeFrom: number;
    TimeTo: number;
    Data: CryptoCompareHistoryDataPoint[]; // The array of historical data points
  };
}

// Type for /data/asset/v1/data
// This contains very detailed asset information
export interface AssetData {
  ID: number | string;
  TYPE?: string;
  ID_LEGACY?: number;
  ID_PARENT_ASSET?: number;
  ID_ASSET_ISSUER?: number;
  SYMBOL: string;
  URI?: string;
  ASSET_TYPE?: string;
  ASSET_ISSUER_NAME?: string;
  PARENT_ASSET_SYMBOL?: string;
  ROOT_ASSET_ID?: number;
  NAME?: string;
  LOGO_URL?: string;
  LAUNCH_DATE?: number; // Unix timestamp
  ASSET_DESCRIPTION?: string; // Full description
  ASSET_DESCRIPTION_SNIPPET?: string; // Short description
  WEBSITE_URL?: string;
  BLOG_URL?: string;
  WHITE_PAPER_URL?: string;
  OTHER_DOCUMENT_URLS?: Array<{ TYPE: string; URL: string }>;
  PRICE_USD?: number;
  PRICE_USD_LAST_UPDATE_TS?: number;
  CIRCULATING_MKT_CAP_USD?: number;
  TOTAL_MKT_CAP_USD?: number;
  SPOT_MOVING_24_HOUR_CHANGE_USD?: number;
  SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD?: number;
  SPOT_MOVING_7_DAY_CHANGE_USD?: number;
  SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD?: number;
  SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD?: number;
  SUPPLY_CIRCULATING?: number;
  SUPPLY_TOTAL?: number;
  SUPPLY_MAX?: number;
  LAST_BLOCK_TIMESTAMP?: number;
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
  ASSET_CUSTODIANS?: Array<{ NAME: string }>;
  CONTROLLED_ADDRESSES?: unknown[] | null;
  ASSET_SECURITY_METRICS?: Array<{
    NAME: string;
    OVERALL_SCORE?: number;
    OVERALL_RANK?: number;
    UPDATED_AT?: number;
  }>;
  SUPPLY_FUTURE?: number;
  SUPPLY_STAKED?: number;
  SUPPLY_BURNT?: number;
  BURN_ADDRESSES?: unknown[] | null;
  LOCKED_ADDRESSES?: unknown[] | null;
  RESERVES_BREAKDOWN?: Array<{
    RESERVE_TYPE: string;
    PERCENTAGE: number;
    DESCRIPTION?: string;
  }>;
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
  DISCORD_SERVERS?: unknown[] | null;
  TELEGRAM_GROUPS?: Array<{
    URL: string;
    MAKE_3RD_PARTY_REQUEST?: boolean;
    NAME?: string;
    USERNAME?: string;
    MEMBERS?: number;
    LAST_UPDATED_TS?: number;
  }>;
  OTHER_SOCIAL_NETWORKS?: Array<{ NAME: string; URL: string }>;
  HELD_TOKEN_SALE?: boolean;
  ASSET_DECIMAL_POINTS?: number;
  ASSET_SYMBOL_GLYPH?: string;
  IS_EXCLUDED_FROM_PRICE_TOPLIST?: boolean | null;
  IS_EXCLUDED_FROM_VOLUME_TOPLIST?: boolean | null;
  IS_EXCLUDED_FROM_MKT_CAP_TOPLIST?: boolean | null;
  ASSET_INDUSTRIES?: Array<{ ASSET_INDUSTRY: string; JUSTIFICATION?: string }>;
  PRICE_USD_SOURCE?: string;
  MKT_CAP_PENALTY?: number;
  SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_DIRECT_USD?: number;
  SPOT_MOVING_24_HOUR_QUOTE_VOLUME_DIRECT_USD?: number;
  SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_USD?: number;
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD?: number;
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_DIRECT_USD?: number;
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_USD?: number;
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD?: number;
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD?: number;
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_DIRECT_USD?: number;
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_USD?: number;
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD?: number;
  SPOT_MOVING_24_HOUR_CHANGE_CONVERSION?: number;
  SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_CONVERSION?: number;
  SPOT_MOVING_7_DAY_CHANGE_CONVERSION?: number;
  SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_CONVERSION?: number;
  SPOT_MOVING_30_DAY_CHANGE_USD?: number;
  SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD?: number;
  SPOT_MOVING_30_DAY_CHANGE_CONVERSION?: number;
  SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_CONVERSION?: number;
  TOPLIST_BASE_RANK?: Record<string, number>;
  ASSET_DESCRIPTION_SUMMARY?: string;
  PROJECT_LEADERS?: Array<{ LEADER_TYPE: string; FULL_NAME: string }>;
  ASSOCIATED_CONTACT_DETAILS?: Array<{
    CONTACT_MEDIUM: string;
    FULL_NAME: string;
  }>;
  SEO_TITLE?: string;
  SEO_DESCRIPTION?: string;
  ASSET_ALTERNATIVE_IDS?: Array<{ NAME: string; ID: string }>;
  SUPPLY_ISSUED?: number;
  SUPPLY_LOCKED?: number;
  HASHING_ALGORITHM?: string | null;
}

export interface MarketDataApiResponse {
  Data: AssetData;
  Err?: unknown;
}

// --- Types for /all/coinlist endpoint ---

export interface CryptoCompareCoinInfo {
  Id: string;
  Url: string;
  ImageUrl?: string; // Relative path, needs BaseImageUrl
  ContentCreatedOn: number;
  Name: string; // Symbol (e.g., BTC)
  Symbol: string;
  CoinName: string; // Full name (e.g., Bitcoin)
  FullName: string; // e.g., Bitcoin (BTC)
  Description?: string;
  AssetTokenStatus?: string;
  Algorithm: string;
  ProofType: string;
  SortOrder: string;
  Sponsored: boolean;
  Taxonomy?: {
    Access?: string;
    FCA?: string;
    FINMA?: string;
    Industry?: string;
    CollateralizedAsset?: string;
    CollateralizedAssetType?: string;
    IsDecentralized?: string;
    IsGood?: string;
    IsPlatform?: string;
    Reputation?: string;
    ConsensusAlgorithm?: string;
    MigrationDescription?: string;
    MigrationStatus?: string;
    TokenId?: string;
    TokenType?: string;
  };
  Rating?: {
    Weiss?: {
      Rating?: string;
      TechnologyAdoptionRating?: string;
      MarketPerformanceRating?: string;
    };
  };
  IsTrading: boolean;
  TotalCoinsMined?: number;
  CirculatingSupply?: number;
  BlockNumber?: number;
  NetHashesPerSecond?: number;
  BlockReward?: number;
  BlockTime?: number;
  AssetLaunchDate?: string; // e.g., "2009-01-03"
  MaxSupply?: number;
  MktCapPenalty?: number;
  IsUsedInDefi?: number;
  IsUsedInNft?: number;
  PlatformType?: string;
  DecimalPoints?: number;
  AlgorithmType?: string;
  Difficulty?: number;
}

export interface CryptoCompareCoinListResponse {
  Response: string; // "Success"
  Message: string;
  BaseImageUrl: string; // Base URL for images (e.g., "https://www.cryptocompare.com")
  BaseLinkUrl: string;
  DefaultWatchlist: {
    CoinIs?: string;
    Sponsor?: Record<string, unknown>;
  };
  Data: {
    [symbol: string]: CryptoCompareCoinInfo; // Coin data keyed by symbol
  };
  Type: number;
}
