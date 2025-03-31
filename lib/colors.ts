// Define HSL colors (same as original PIE_COLORS)
const BASE_COLORS_HSL = [
  "hsl(210, 70%, 50%)", // Primary Blue
  "hsl(150, 60%, 45%)", // Green
  "hsl(30, 70%, 50%)", // Orange
  "hsl(270, 60%, 60%)", // Purple
  "hsl(0, 65%, 55%)", // Red
  "hsl(60, 60%, 45%)", // Yellow
  "hsl(180, 50%, 45%)", // Teal
  "hsl(330, 65%, 60%)", // Pink
];

// Simple cache and predefined map for consistency
const colorCache: Record<string, string> = {
  // Predefine some common symbols based on sample data
  BTC: BASE_COLORS_HSL[0], // Example: Bitcoin gets Blue
  ETH: BASE_COLORS_HSL[1], // Ethereum gets Green
  XRP: BASE_COLORS_HSL[4], // Ripple gets Red
  AVAX: BASE_COLORS_HSL[4], // Avalanche gets Red (Example reuse)
  SUI: BASE_COLORS_HSL[0], // Sui gets Blue (Example reuse)
  BNB: BASE_COLORS_HSL[5], // Binance Coin gets Yellow
  DOGE: BASE_COLORS_HSL[2], // Dogecoin gets Orange
  ADA: BASE_COLORS_HSL[6], // Cardano gets Teal
  XLM: BASE_COLORS_HSL[7], // Stellar gets Pink
};
let nextColorIndex = 0;

// Helper to parse HSL string and apply opacity
const applyOpacityToHSL = (hslColor: string, opacity: number): string => {
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (match) {
    const [, h, s, l] = match;
    return `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
  }
  const grayFallback = "hsla(0, 0%, 50%, 0.1)"; // Example: semi-transparent gray
  try {
    if (hslColor.startsWith("hsla") || hslColor.startsWith("rgba")) {
      return grayFallback;
    }
    if (hslColor.startsWith("#")) {
      return grayFallback;
    }
    if (hslColor.startsWith("rgb(")) {
      return hslColor.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
    }
  } catch (e) {
    // Ignore errors during fallback attempts
  }
  return grayFallback; // Final fallback
};

/**
 * Gets a consistent color for a crypto asset symbol.
 * Uses a predefined map for common symbols and cycles through BASE_COLORS_HSL for others.
 * @param symbol - The crypto asset symbol (e.g., 'BTC', 'ETH').
 * @param opacity - Optional opacity value (0 to 1). If provided, returns hsla format.
 * @returns Color string (hsl or hsla).
 */
export const getAssetColor = (
  symbol: string | null | undefined,
  opacity?: number,
): string => {
  if (!symbol) {
    // Return a default neutral color if symbol is null/undefined
    const defaultColor = "hsl(0, 0%, 80%)"; // Light gray
    return opacity !== undefined
      ? applyOpacityToHSL(defaultColor, opacity)
      : defaultColor;
  }

  const upperSymbol = symbol.toUpperCase();

  if (!colorCache[upperSymbol]) {
    // Assign the next color in the cycle if not predefined or cached
    colorCache[upperSymbol] =
      BASE_COLORS_HSL[nextColorIndex % BASE_COLORS_HSL.length];
    nextColorIndex++;
  }

  const baseColor = colorCache[upperSymbol];

  if (opacity !== undefined) {
    return applyOpacityToHSL(baseColor, opacity);
  }

  return baseColor;
};
