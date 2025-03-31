import { usePortfolioStore } from "@/lib/store";
import type { CryptoComparePriceData } from "@/types/api/cryptocompare";
import type { CryptoHolding } from "@/types/holding";
import { useEffect, useMemo, useState } from "react";
import { useCryptoPrices } from "./useCryptoData";

export interface ProcessedHolding
  extends Omit<CryptoHolding, "changePct24h" | "changeAbs24h"> {
  currentPrice: number;
  value: number;
  changePct24h: number | undefined;
  changeAbs24h: number | undefined;
}

export interface MoverData {
  id: string;
  name: string;
  symbol: string;
  changePct: number;
  changeAbs: number;
  image?: string;
}

interface PortfolioData {
  processedHoldings: ProcessedHolding[];
  totalValue: number;
  overallChangePct24h: number;
  totalAbsoluteChange24h: number;
  chartData: ProcessedHolding[];
  topMover: ProcessedHolding | null;
  bottomMover: ProcessedHolding | null;
  topMoversList: MoverData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function usePortfolioData(targetCurrency = "USD"): PortfolioData {
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  const { holdings } = usePortfolioStore();

  useEffect(() => {
    setIsStoreHydrated(true);
  }, []);

  const holdingIds = useMemo(() => {
    return isStoreHydrated && holdings.length > 0
      ? Array.from(new Set(holdings.map((h) => h.id)))
      : [];
  }, [holdings, isStoreHydrated]);

  // Fetch live prices using the existing hook
  const {
    data: livePricesMap,
    isLoading: isPriceLoading,
    isError,
    error,
  } = useCryptoPrices(holdingIds, targetCurrency, {
    // Enable query only when store is hydrated and we have IDs
    enabled: isStoreHydrated && holdingIds.length > 0,
  });

  // Combine holdings and prices, calculate derived values
  const portfolioData = useMemo((): Omit<
    PortfolioData,
    "isLoading" | "isError" | "error"
  > => {
    /**
     * This memoized calculation processes the raw holdings and live prices
     * to generate derived portfolio metrics.
     *
     * Steps:
     * 1. Iterate through each holding from the Zustand store.
     * 2. Find the corresponding live price data from the `useCryptoPrices` hook.
     * 3. Calculate the current value of the holding (quantity * price).
     * 4. Extract 24h percentage change (changePct24h) and absolute change (changeAbs24h) from price data.
     * 5. Aggregate the total portfolio value.
     * 6. Calculate the *weighted* overall 24h percentage change:
     *    - Sum the product of each holding's value and its changePct24h.
     *    - Sum the total value of holdings that *have* change data (the weight).
     *    - Divide the weighted change sum by the total weight.
     * 7. Calculate the total absolute 24h change by summing the changeAbs24h multiplied by quantity for each holding.
     * 8. Identify the single top and bottom movers based on changePct24h.
     * 9. Create a list of the top 4 movers based on the *absolute* value of changePct24h.
     * 10. Sort the processed holdings by their current value in descending order.
     * 11. Return all calculated metrics.
     */
    if (!isStoreHydrated || holdings.length === 0) {
      return {
        processedHoldings: [],
        totalValue: 0,
        overallChangePct24h: 0,
        totalAbsoluteChange24h: 0,
        chartData: [],
        topMover: null,
        bottomMover: null,
        topMoversList: [],
      };
    }

    let calculatedTotalValue = 0;
    let totalWeightForChange = 0;
    let weightedChangeSum = 0;
    let calculatedTotalAbsChange = 0;
    let topMover: ProcessedHolding | null = null;
    let bottomMover: ProcessedHolding | null = null;
    const moversCalculationList: ProcessedHolding[] = [];

    const processedHoldings: ProcessedHolding[] = holdings
      .map((holding) => {
        const priceData: CryptoComparePriceData | undefined =
          livePricesMap?.[holding.id] ?? undefined;
        const currentPrice = priceData?.PRICE ?? 0;
        const value = holding.quantity * currentPrice;
        const changePct24h = priceData?.CHANGEPCT24HOUR ?? undefined;
        const changeAbs24h = priceData?.CHANGE24HOUR ?? undefined;

        // Aggregate total value
        calculatedTotalValue += value;

        // Calculate sums for weighted average percentage change
        if (changePct24h !== undefined) {
          // Add the value-weighted change to the sum
          weightedChangeSum += value * changePct24h;
          // Add the value to the total weight (only include assets with change data)
          totalWeightForChange += value;
        }

        // Aggregate total absolute change (using absolute change per coin * quantity)
        if (changeAbs24h !== undefined) {
          calculatedTotalAbsChange += changeAbs24h * holding.quantity;
        }

        // Create the processed holding object
        const processed: ProcessedHolding = {
          ...holding,
          currentPrice,
          value,
          changePct24h,
          changeAbs24h,
        };

        // Find the single top mover (highest positive change %)
        if (changePct24h !== undefined) {
          if (
            topMover === null ||
            changePct24h > (topMover.changePct24h ?? Number.NEGATIVE_INFINITY)
          ) {
            topMover = processed;
          }
          // Find the single bottom mover (lowest negative change %)
          if (
            bottomMover === null ||
            changePct24h <
              (bottomMover.changePct24h ?? Number.POSITIVE_INFINITY)
          ) {
            bottomMover = processed;
          }
        }
        // Add to list for calculating top movers list (requires both % and abs change)
        if (changePct24h !== undefined && changeAbs24h !== undefined) {
          moversCalculationList.push(processed);
        }

        return processed;
      })
      .sort((a, b) => b.value - a.value);

    // Final calculation for overall weighted average percentage change
    const overallChangePct24h =
      totalWeightForChange > 0 ? weightedChangeSum / totalWeightForChange : 0;

    // Calculate Top Movers List (top 4 by absolute value of percentage change)
    const topMoversList: MoverData[] = moversCalculationList
      .sort(
        (a, b) => Math.abs(b.changePct24h ?? 0) - Math.abs(a.changePct24h ?? 0),
      )
      .slice(0, 4)
      .map((h) => ({
        id: h.id,
        name: h.name,
        symbol: h.symbol,
        changePct: h.changePct24h ?? 0,
        changeAbs: h.changeAbs24h ?? 0,
        image: h.image,
      }));

    return {
      processedHoldings,
      totalValue: calculatedTotalValue,
      overallChangePct24h,
      totalAbsoluteChange24h: calculatedTotalAbsChange,
      chartData: processedHoldings,
      topMover,
      bottomMover,
      topMoversList,
    };
  }, [holdings, livePricesMap, isStoreHydrated]);

  // Determine final loading state
  // Loading if store not hydrated OR if we have IDs but prices are still loading
  const isLoading =
    !isStoreHydrated || (holdingIds.length > 0 && isPriceLoading);

  return {
    ...portfolioData,
    isLoading,
    isError,
    error: error || null,
  };
}
