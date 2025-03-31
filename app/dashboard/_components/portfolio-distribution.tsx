"use client";

import { DataCard } from "@/components/ui/data-card";
import {
  type ProcessedHolding,
  usePortfolioData,
} from "@/hooks/usePortfolioData";
import { getAssetColor } from "@/lib/colors";
import { usePortfolioStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PortfolioDistributionSkeleton } from "./dashboard-skeletons";

export function PortfolioDistribution() {
  const { hoveredSymbol, setHoveredSymbol } = usePortfolioStore();

  const { chartData, totalValue, isLoading, isError, error } =
    usePortfolioData();

  const handleLegendHover = (data: { value: string; payload?: unknown }) => {
    setHoveredSymbol(data.value);
  };

  if (isLoading) {
    return <PortfolioDistributionSkeleton />;
  }

  if (isError) {
    return (
      <DataCard
        title="Portfolio Distribution"
        cardClassName="flex items-center justify-center"
      >
        <div className="text-center text-destructive">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm font-medium">Error loading distribution.</p>
        </div>
      </DataCard>
    );
  }

  return (
    <DataCard
      title="Portfolio Distribution"
      contentClassName="p-0"
      cardClassName="overflow-visible"
      aria-label="Portfolio Distribution"
    >
      {chartData.length > 0 ? (
        <div
          className="h-[320px] relative"
          role="img"
          aria-label="Portfolio distribution pie chart"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="symbol"
                stroke="hsl(var(--background))"
                strokeWidth={1}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.symbol}`}
                    fill={getAssetColor(entry.symbol)}
                    opacity={
                      hoveredSymbol === entry.symbol || hoveredSymbol === null
                        ? 1
                        : 0.5
                    }
                    className="transition-opacity duration-150"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ProcessedHolding;
                    const percentage =
                      totalValue > 0
                        ? ((data.value / totalValue) * 100).toFixed(1)
                        : "0.0";
                    return (
                      <div
                        className="bg-popover text-popover-foreground border p-3 rounded-lg shadow-lg text-xs"
                        role="tooltip"
                        aria-label={`${data.symbol} distribution details`}
                      >
                        <div className="font-medium mb-1">
                          {data.name} ({data.symbol})
                        </div>
                        <div className="text-muted-foreground">
                          Value: {formatCurrency(data.value)}
                        </div>
                        <div className="text-muted-foreground">
                          {percentage}% of portfolio
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconSize={10}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  lineHeight: "1.5",
                  paddingLeft: "10px",
                }}
                onMouseEnter={handleLegendHover}
                onMouseLeave={() => setHoveredSymbol(null)}
                formatter={(value, entry) => {
                  const payload = (entry as { payload?: unknown })?.payload as
                    | ProcessedHolding
                    | undefined;
                  const name = payload?.name ?? value;
                  return (
                    <span
                      className={`transition-opacity duration-150 ${hoveredSymbol === value || hoveredSymbol === null ? "opacity-100" : "opacity-50"}`}
                    >
                      {name}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground h-[320px] flex items-center justify-center">
          No holdings to display
        </div>
      )}
    </DataCard>
  );
}
