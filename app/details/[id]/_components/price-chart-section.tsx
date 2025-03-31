"use client";

import PriceChart from "@/components/price-chart";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { useToast } from "@/hooks/use-toast";
import { type Timeframe, useHistoricalData } from "@/hooks/useCryptoData";
import { AlertTriangle } from "lucide-react";
import React, { useState, useCallback } from "react";
import { ResponsiveContainer } from "recharts";

interface PriceChartSectionProps {
  coinId: string;
  symbol: string;
}

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "7d" },
  { label: "1M", value: "30d" },
  { label: "3M", value: "90d" },
  { label: "1Y", value: "1y" },
  // { label: "Max", value: "max" },
];

/**
 * Client Component: Fetches and displays the historical price chart with timeframe controls.
 */
export function PriceChartSection({ coinId, symbol }: PriceChartSectionProps) {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");

  const {
    data: chartData = [],
    isLoading: isChartLoading,
    isError: isChartError,
    error: chartError,
    isFetching: isChartFetching,
  } = useHistoricalData(coinId, timeframe, "USD", {
    enabled: !!coinId,
  });

  const changeTimeframe = useCallback((newTimeframe: Timeframe) => {
    setTimeframe(newTimeframe);
  }, []);

  const timeframeButtons = (
    <div className="flex space-x-1 overflow-x-auto">
      {TIMEFRAMES.map((tf) => (
        <Button
          key={tf.value}
          variant="ghost"
          size="sm"
          className={`h-6 px-2 text-xs rounded flex-shrink-0 ${timeframe === tf.value ? "bg-muted font-semibold" : "hover:bg-muted/50 text-muted-foreground"}`}
          onClick={() => changeTimeframe(tf.value)}
          aria-pressed={timeframe === tf.value}
          disabled={isChartFetching} // Disable buttons during fetch
        >
          {tf.label}
        </Button>
      ))}
    </div>
  );

  return (
    <DataCard
      title="Price Chart"
      headerContent={timeframeButtons}
      headerClassName="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between gap-1"
      contentClassName="pt-4 h-[200px] max-h-[200px]"
      isLoading={isChartLoading && !chartData.length}
      loadingHeight="h-full"
    >
      {/* Handle Error State */}
      {isChartError && !isChartLoading && (
        <div className="flex flex-col items-center justify-center h-full text-destructive text-center">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium">Error Loading Chart</p>
          <p className="text-xs text-muted-foreground">
            Could not load {timeframe} data.
          </p>
        </div>
      )}

      {/* Render Chart when not in initial loading or error state */}
      {!isChartError && (
        <ResponsiveContainer width="100%" height="100%">
          <PriceChart
            data={chartData}
            type="bar"
            loading={isChartFetching}
            enableZoom={false}
            symbol={symbol}
          />
        </ResponsiveContainer>
      )}
    </DataCard>
  );
}
