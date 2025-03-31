/**
 * Represents the data structure for OHLC (Open, High, Low, Close) chart data.
 */
export interface OHLCData {
  timestamp: number; // Unix timestamp (milliseconds)
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Defines the possible timeframes for historical chart data.
 */
type Timeframe = "1d" | "7d" | "14d" | "30d" | "90d" | "180d" | "1y" | "max";
