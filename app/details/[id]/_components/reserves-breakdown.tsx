"use client";

import { DataCard } from "@/components/ui/data-card";
import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface ReserveItem {
  RESERVE_TYPE: string;
  PERCENTAGE: number;
  DESCRIPTION?: string | null;
}

interface ReservesBreakdownProps {
  breakdown: ReserveItem[];
  assetName: string;
}

const PIE_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#9C27B0",
  "#673AB7",
];

/**
 * Client Component: Displays the reserve composition pie chart.
 * Uses Recharts, which requires client-side rendering.
 */
export function ReservesBreakdown({
  breakdown,
  assetName,
}: ReservesBreakdownProps) {
  const reservesChartData = useMemo(() => {
    if (!breakdown) return [];
    return breakdown
      .map((item) => ({
        name: item.RESERVE_TYPE.replace(/_/g, " ").replace(
          /\b\w/g,
          (l: string) => l.toUpperCase(),
        ),
        value: item.PERCENTAGE,
        description: item.DESCRIPTION,
      }))
      .sort((a, b) => b.value - a.value);
  }, [breakdown]);

  if (!reservesChartData || reservesChartData.length === 0) {
    return null;
  }

  return (
    <DataCard
      title="Reserve Composition"
      description={`How ${assetName}'s value is backed.`}
      contentClassName="p-4 pt-0"
    >
      <div className="h-[220px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={reservesChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              innerRadius={35}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {reservesChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover text-popover-foreground p-2 rounded shadow-md border text-xs max-w-[200px]">
                      <p className="font-bold">
                        {data.name}: {data.value.toFixed(2)}%
                      </p>
                      {data.description && (
                        <p className="text-muted-foreground mt-1">
                          {data.description}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconSize={10}
              wrapperStyle={{
                fontSize: "12px",
                paddingLeft: "10px",
                overflowY: "auto",
                maxHeight: "180px",
              }}
              formatter={(value, entry: any) => {
                if (!entry?.payload) return null;
                const name = entry.payload.name ?? "Unknown";
                const percentage = entry.payload.value ?? 0;
                return (
                  <span
                    className="text-muted-foreground truncate block max-w-[100px]"
                    title={`${name} (${percentage.toFixed(1)}%)`}
                  >
                    {name} ({percentage.toFixed(1)}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DataCard>
  );
}
