import { z } from "zod";

// Base schemas
export const CryptoCurrencySchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  currentPrice: z.number(),
  image: z.string().optional(),
  marketCapRank: z.number().optional(),
  marketCap: z.number().optional(),
  totalVolume: z.number().optional(),
  priceChangePercentage24h: z.number().optional(),
  circulatingSupply: z.number().optional(),
  totalSupply: z.number().optional(),
});

const HistoricalDataSchema = z.object({
  date: z.string(),
  price: z.number(),
  volume: z.number(),
  priceChange: z.number(),
});

const OHLCDataSchema = z.object({
  timestamp: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
});

export const SearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  market_cap_rank: z.number().optional(),
  thumb: z.string().optional(),
  large: z.string().optional(),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    __source: z.enum(["api", "cache", "error"]),
    __provider: z.string(),
    __rateLimit: z
      .object({
        limit: z.number(),
        remaining: z.number(),
        reset: z.number(),
      })
      .optional(),
    __cache_error: z.boolean().optional(),
  });

// Export types generated from schemas
export type HistoricalData = z.infer<typeof HistoricalDataSchema>;
export type OHLCData = z.infer<typeof OHLCDataSchema>;
