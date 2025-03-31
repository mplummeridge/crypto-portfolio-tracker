"use client";

import { DataCard } from "@/components/ui/data-card";
import PriceChangeLabel from "@/components/ui/price-change-label";
import {
  type ProcessedHolding,
  usePortfolioData,
} from "@/hooks/usePortfolioData";
import { getAssetColor } from "@/lib/colors";
import { usePortfolioStore } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PortfolioValueSkeleton } from "./dashboard-skeletons";

export function PortfolioValueCard() {
  const { hoveredSymbol, setHoveredSymbol } = usePortfolioStore();

  const { totalValue, chartData, isLoading, isError, error } =
    usePortfolioData();

  if (isLoading) {
    return <PortfolioValueSkeleton />;
  }

  if (isError) {
    return (
      <DataCard
        title="Portfolio Value"
        cardClassName="flex items-center justify-center"
      >
        <div className="text-center text-destructive">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm font-medium">Error loading portfolio value.</p>
        </div>
      </DataCard>
    );
  }

  const handleChartHover = (state: {
    isTooltipActive?: boolean;
    activePayload?: Array<{ payload: unknown }>;
  }) => {
    if (
      state.isTooltipActive &&
      state.activePayload &&
      state.activePayload.length > 0
    ) {
      const payloadData = state.activePayload[0].payload as ProcessedHolding;
      setHoveredSymbol(payloadData.symbol || null);
    } else {
      setHoveredSymbol(null);
    }
  };

  return (
    <DataCard
      contentClassName="p-4"
      cardClassName="overflow-visible"
      aria-label="Portfolio Value Summary"
    >
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-1">
          Total Portfolio Value
        </h2>
        <output className="text-5xl font-bold mb-6 block" aria-live="polite">
          {formatCurrency(totalValue)}
        </output>
      </div>

      {chartData.length > 0 && (
        <section
          className="h-[240px] relative px-0 pt-4 mt-6"
          aria-label="Portfolio Value Distribution Bar Chart"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              onMouseMove={handleChartHover}
              onMouseLeave={() => setHoveredSymbol(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="symbol"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, true)}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                width={55}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ProcessedHolding;
                    return (
                      <div className="bg-popover text-popover-foreground p-3 rounded shadow-lg border text-sm">
                        <p className="font-bold text-sm mb-1">
                          {data.name} ({data.symbol})
                        </p>
                        <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1.5">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="text-right font-medium">
                            {formatCurrency(data.value)}
                          </span>

                          <span className="text-muted-foreground">
                            Holdings:
                          </span>
                          <span className="text-right font-medium">
                            {formatNumber(data.quantity)} {data.symbol}
                          </span>

                          <span className="text-muted-foreground">Price:</span>
                          <span className="text-right font-medium">
                            {formatCurrency(data.currentPrice)}
                          </span>

                          <span className="text-muted-foreground">
                            Change (24h):
                          </span>
                          <div className="text-right font-medium flex flex-col items-end">
                            <PriceChangeLabel change={data.changePct24h} />
                            <PriceChangeLabel
                              change={data.changeAbs24h}
                              changeType="absolute"
                              prefix={
                                data.changeAbs24h && data.changeAbs24h >= 0
                                  ? "+"
                                  : ""
                              }
                              suffix=" USD"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.symbol}`}
                    fill={getAssetColor(entry.symbol)}
                    opacity={
                      hoveredSymbol && hoveredSymbol !== entry.symbol ? 0.5 : 1
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </DataCard>
  );
}
