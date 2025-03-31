import type { CryptoHolding } from "@/types/holding";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  mapCoinIdToSymbol,
  mapCoinIdsToSymbols,
} from "./utils";

describe("Utility Functions", () => {
  // Tests for formatCurrency
  describe("formatCurrency", () => {
    it("should format positive numbers correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should format zero correctly", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("should format negative numbers correctly", () => {
      // Note: Intl.NumberFormat represents negative currency differently
      expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
    });

    it("should use compact notation when specified", () => {
      expect(formatCurrency(1234567, true)).toBe("$1.23M");
      expect(formatCurrency(1234, true)).toBe("$1.23K");
    });

    it("should handle small numbers with compact notation", () => {
      expect(formatCurrency(50.75, true)).toBe("$50.75");
    });
  });

  describe("formatDate", () => {
    it("should format a valid date object", () => {
      expect(formatDate(new Date(2024, 5, 15))).toBe("Jun 15, 2024");
    });

    it("should format a valid date string", () => {
      expect(formatDate("2024-03-21T12:00:00Z")).toBe("Mar 21, 2024");
    });

    it("should format a valid timestamp number", () => {
      // Note: Month is 0-indexed in Date constructor
      expect(formatDate(new Date(2023, 0, 1).getTime())).toBe("Jan 1, 2023");
    });

    it("should return 'Invalid Date' for an invalid date string", () => {
      expect(formatDate("not-a-date")).toBe("Invalid Date");
    });

    it("should return 'N/A' for null or undefined input", () => {
      expect(formatDate(null)).toBe("N/A");
      expect(formatDate(undefined)).toBe("N/A");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers less than 1000 without suffix", () => {
      expect(formatNumber(123.456)).toBe("123.46");
      expect(formatNumber(0)).toBe("0.00");
      expect(formatNumber(-500)).toBe("-500.00");
    });

    it("should format thousands with K suffix", () => {
      expect(formatNumber(1500)).toBe("1.50K");
      expect(formatNumber(99999)).toBe("100.00K");
    });

    it("should format millions with M suffix", () => {
      expect(formatNumber(1234567)).toBe("1.23M");
      expect(formatNumber(999999999)).toBe("1000.00M"); // Or 1.00B depending on exact threshold
    });

    it("should format billions with B suffix", () => {
      expect(formatNumber(1000000000)).toBe("1.00B");
      expect(formatNumber(2500000000)).toBe("2.50B");
    });

    it("should allow custom digits", () => {
      expect(formatNumber(12345.67, 0)).toBe("12K");
      expect(formatNumber(12345.67, 3)).toBe("12.346K");
    });

    it("should return 'N/A' for invalid inputs", () => {
      expect(formatNumber(Number.NaN)).toBe("N/A");
      // @ts-expect-error Testing invalid input type
      expect(formatNumber(null)).toBe("N/A");
      // @ts-expect-error Testing invalid input type
      expect(formatNumber(undefined)).toBe("N/A");
    });
  });

  describe("mapCoinIdToSymbol", () => {
    it("should return the correct symbol for a known ID (case-insensitive)", () => {
      expect(mapCoinIdToSymbol("bitcoin")).toBe("BTC");
      expect(mapCoinIdToSymbol("Ethereum")).toBe("ETH");
      expect(mapCoinIdToSymbol("XRP")).toBe("XRP");
    });

    it("should return null for an unknown ID", () => {
      expect(mapCoinIdToSymbol("unknowncoin")).toBeNull();
    });

    it("should return null for an empty string or null input", () => {
      expect(mapCoinIdToSymbol("")).toBeNull();
      // @ts-expect-error Testing invalid input type
      expect(mapCoinIdToSymbol(null)).toBeNull();
      // @ts-expect-error Testing invalid input type
      expect(mapCoinIdToSymbol(undefined)).toBeNull();
    });
  });

  describe("mapCoinIdsToSymbols", () => {
    it("should map an array of known IDs (case-insensitive)", () => {
      const ids = ["bitcoin", "Ethereum", "SOLANA"];
      expect(mapCoinIdsToSymbols(ids)).toEqual({
        bitcoin: "BTC",
        Ethereum: "ETH",
        SOLANA: "SOL",
      });
    });

    it("should handle mixed known and unknown IDs", () => {
      const ids = ["bitcoin", "fakecoin", "ethereum"];
      expect(mapCoinIdsToSymbols(ids)).toEqual({
        bitcoin: "BTC",
        fakecoin: null,
        ethereum: "ETH",
      });
    });

    it("should handle an empty input array", () => {
      expect(mapCoinIdsToSymbols([])).toEqual({});
    });

    it("should handle IDs with different casing in the input array", () => {
      const ids = ["Bitcoin", "bitcoin", "BITCOIN"];
      expect(mapCoinIdsToSymbols(ids)).toEqual({
        Bitcoin: "BTC",
        bitcoin: "BTC",
        BITCOIN: "BTC",
      });
    });

    it("should handle empty strings within the array", () => {
      const ids = ["bitcoin", "", "ethereum"];
      expect(mapCoinIdsToSymbols(ids)).toEqual({
        bitcoin: "BTC",
        "": null,
        ethereum: "ETH",
      });
    });
  });
});
