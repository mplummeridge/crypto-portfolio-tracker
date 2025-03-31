"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { OHLCData } from "@/lib/types/chart";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import React, { useMemo, memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PriceChartProps {
  data: OHLCData[];
  type: "line" | "bar";
  loading: boolean;
  symbol: string;
  enableZoom?: boolean;
}

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[]; // Revert payload type to any[]
  label?: number | string; // Timestamp is usually a number
  symbol: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  symbol,
}: CustomTooltipProps) => {
  if (active && payload && payload.length && label != null) {
    // Check label is not null/undefined
    const dataPoint = payload[0].payload; // Access the full data point
    const timestamp = label; // Label is the timestamp

    // Extract OHLC values
    const open = dataPoint.open ?? 0;
    const high = dataPoint.high ?? 0;
    const low = dataPoint.low ?? 0;
    const close = dataPoint.close ?? 0;

    return (
      <div className="bg-background border border-border p-3 rounded shadow-lg text-xs">
        <div className="mb-1">
          <p className="font-bold text-sm">{symbol.toUpperCase()}</p>
          <p className="text-muted-foreground">
            {formatTimestamp(Number(timestamp))}
          </p>
        </div>
        {/* Display OHLC data */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span className="text-muted-foreground">Open:</span>
          <span className="font-medium text-right">{formatCurrency(open)}</span>
          <span className="text-muted-foreground">High:</span>
          <span className="font-medium text-right text-green-600 dark:text-green-500">
            {formatCurrency(high)}
          </span>
          <span className="text-muted-foreground">Low:</span>
          <span className="font-medium text-right text-red-600 dark:text-red-500">
            {formatCurrency(low)}
          </span>
          <span className="text-muted-foreground">Close:</span>
          <span className="font-medium text-right">
            {formatCurrency(close)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const PriceChart = memo(
  ({ data, type, loading, symbol, enableZoom = false }: PriceChartProps) => {
    const formattedData = useMemo(() => {
      // Input data is OHLCData[]
      if (!data || data.length === 0) return [];

      // Sort data by timestamp
      const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

      // Map to { timestamp: number, price: number, value: number, ...ohlc, isGain: boolean } format for Recharts
      return sortedData.map((item, index) => {
        const prevClose = index > 0 ? sortedData[index - 1].close : item.open; // Use previous close or current open for comparison
        const isGain = item.close >= prevClose;
        return {
          timestamp: item.timestamp,
          price: item.close,
          value: item.close,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          // Add gain/loss flag
          isGain: isGain,
        };
      });
    }, [data]);

    if (loading) {
      return (
        <Skeleton
          className="h-[170px] w-full"
          data-testid="skeleton"
          aria-label="Loading chart data"
        />
      );
    }

    if (!formattedData || formattedData.length === 0) {
      return (
        <div
          className="h-full w-full min-h-[200px] flex items-center justify-center border rounded-md"
          role="alert"
        >
          <p className="text-muted-foreground">No historical data available</p>
        </div>
      );
    }

    // Determine color based on start/end price
    const startPrice = formattedData[0]?.close ?? 0;
    const endPrice = formattedData[formattedData.length - 1]?.close ?? 0;
    const strokeColor =
      endPrice >= startPrice
        ? "hsl(var(--chart-positive))"
        : "hsl(var(--chart-negative))";

    const ChartComponent = type === "line" ? LineChart : BarChart;

    return (
      <ResponsiveContainer height={200}>
        <ChartComponent
          data={formattedData}
          margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border) / 0.5)"
          />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp: number | string) =>
              formatTimestamp(Number(timestamp))
            }
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={5}
          />
          <YAxis
            // Explicitly calculate domain with a buffer
            domain={[
              (dataMin: number) => Math.max(0, dataMin * 0.95), // Ensure min is not below 0, add 5% buffer
              (dataMax: number) => dataMax * 1.05, // Add 5% buffer to max
            ]}
            tickFormatter={(value: number) => formatCurrency(value)}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-3}
          />
          <Tooltip
            content={<CustomTooltip symbol={symbol} />}
            cursor={{
              stroke: "hsl(var(--foreground))",
              strokeDasharray: "3 3",
            }}
            wrapperStyle={{ outline: "none" }}
          />

          {type === "line" && (
            <Line
              type="monotone"
              dataKey={"price"}
              stroke={strokeColor}
              strokeWidth={2}
              dot={true}
              isAnimationActive={true}
              animationDuration={300}
            />
          )}

          {type === "bar" && (
            <Bar
              dataKey="value"
              isAnimationActive={true}
              animationDuration={300}
            >
              {/* Map data to Cells for individual bar colors */}
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.timestamp}`} // Use timestamp as key
                  fill={
                    entry.isGain
                      ? "hsl(var(--chart-positive))"
                      : "hsl(var(--chart-negative))"
                  }
                />
              ))}
            </Bar>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  },
);

PriceChart.displayName = "PriceChart";

export default PriceChart;
