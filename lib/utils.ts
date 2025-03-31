import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 * @param value - The number to format
 * @param compact - Whether to use compact notation (e.g. 1.2M instead of 1,200,000)
 */
export function formatCurrency(value: number, compact = false): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

export function formatDate(
  dateInput: Date | string | number | null | undefined,
): string {
  if (!dateInput) {
    return "N/A"; // Or handle as appropriate
  }

  try {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    // console.error("Error formatting date:", error);
    return "Error";
  }
}

// Format numbers for display (Moved from mock-api.ts)
export function formatNumber(num: number, digits = 2): string {
  if (num === null || num === undefined || Number.isNaN(num)) return "N/A";

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(digits)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(digits)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(digits)}K`;
  }

  return num.toFixed(digits);
}

/**
 * Formats a millisecond timestamp into a date string (e.g., "MMM DD").
 * @param timestamp - The timestamp in milliseconds.
 * @returns Formatted date string.
 */
export function formatTimestamp(timestamp: number, tickCount?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// --- Static ID to Symbol Map ---
// Contains lowercase IDs mapped to uppercase symbols based on common cryptos.
// This replaces the need to import and iterate over MOCK_CRYPTOS for this specific purpose.
// TODO: Replace with actual API data
const COIN_ID_TO_SYMBOL_MAP = new Map<string, string>([
  ["bitcoin", "BTC"],
  ["ethereum", "ETH"],
  ["tether", "USDT"],
  ["xrp", "XRP"],
  ["binance-coin", "BNB"],
  ["solana", "SOL"],
  ["usd-coin", "USDC"],
  ["dogecoin", "DOGE"],
  ["cardano", "ADA"],
  ["tron", "TRX"],
  ["staked-ether", "STETH"],
  ["wrapped-bitcoin", "WBTC"],
  ["the-open-network", "TON"],
  ["unus-sed-leo", "LEO"],
  ["chainlink", "LINK"],
  ["wrapped-steth", "WSTETH"],
  ["stellar", "XLM"],
  ["avalanche", "AVAX"],
  ["usds", "USDS"],
  ["sui", "SUI"],
  ["litecoin", "LTC"],
  ["polkadot", "DOT"],
]);

// --- End Static Map ---

/**
 * Maps an array of cryptocurrency IDs (case-insensitive) to their corresponding symbols.
 * Uses a pre-defined static map for efficiency.
 * @param coinIds - Array of coin IDs (e.g., ["bitcoin", "ethereum", "invalid-id"]).
 * @returns A Record mapping the original (case-preserved) ID to its uppercase symbol or null if not found.
 */
export function mapCoinIdsToSymbols(
  coinIds: string[],
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const id of coinIds) {
    const lowerCaseId = id.toLowerCase();
    const symbol = COIN_ID_TO_SYMBOL_MAP.get(lowerCaseId) || null;
    if (!symbol) {
      // Only log warning if the ID is non-empty
      if (id) {
        // console.warn(
        //   `mapCoinIdsToSymbols: Could not map coin ID '${id}' to a symbol.`,
        // );
      }
    }
    result[id] = symbol; // Store using the original ID casing
  }
  return result;
}

/**
 * Maps a single cryptocurrency ID (case-insensitive) to its corresponding symbol.
 * @param coinId - The coin ID (e.g., "bitcoin").
 * @returns The uppercase symbol (e.g., "BTC") or null if not found.
 */
export function mapCoinIdToSymbol(coinId: string): string | null {
  if (!coinId) return null;
  const lowerCaseId = coinId.toLowerCase();
  return COIN_ID_TO_SYMBOL_MAP.get(lowerCaseId) || null;
}
