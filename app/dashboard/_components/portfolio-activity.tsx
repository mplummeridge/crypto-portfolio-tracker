"use client";

import { DataCard } from "@/components/ui/data-card";
import PriceChangeLabel from "@/components/ui/price-change-label";
import { MoverData, usePortfolioData } from "@/hooks/usePortfolioData";
import { Activity, AlertTriangle, Bitcoin, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PortfolioActivitySkeleton } from "./dashboard-skeletons";

export function PortfolioActivity() {
  const {
    overallChangePct24h,
    totalAbsoluteChange24h,
    topMoversList,
    isLoading,
    isError,
    error,
  } = usePortfolioData();

  if (isLoading) {
    return <PortfolioActivitySkeleton />;
  }

  if (isError) {
    return (
      <DataCard
        title={
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Portfolio Activity (24h)
          </span>
        }
        cardClassName="flex items-center justify-center"
      >
        <div className="text-center text-destructive">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm font-medium">Error loading activity data.</p>
        </div>
      </DataCard>
    );
  }

  return (
    <DataCard
      title={
        <span className="flex items-center gap-2">
          <Activity
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          Portfolio Activity (24h)
        </span>
      }
      cardClassName="overflow-visible"
      aria-label="Portfolio Market Activity (24h)"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <section
            className="bg-muted/50 p-4 rounded-lg"
            aria-label="Portfolio Percentage Value Change (24h)"
          >
            <div className="text-xs text-muted-foreground mb-1">
              24h Change (%)
            </div>
            <PriceChangeLabel
              change={overallChangePct24h}
              className="text-base font-medium block mb-0.5"
              role="status" // Keep role=status for live updates
              aria-live="polite"
            />
          </section>

          <section
            className="bg-muted/50 p-4 rounded-lg"
            aria-label="Portfolio Absolute Value Change (24h)"
          >
            <div className="text-xs text-muted-foreground mb-1">
              24h Change (USD)
            </div>
            <PriceChangeLabel
              change={totalAbsoluteChange24h}
              changeType="absolute"
              prefix={totalAbsoluteChange24h >= 0 ? "+" : ""}
              suffix=" USD"
              className="text-base font-medium block mb-0.5"
              role="status" // Keep role=status for live updates
              aria-live="polite"
            />
          </section>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Top Movers
          </h3>
          {topMoversList.length > 0 ? (
            <ul
              className="space-y-2"
              aria-label="Top moving cryptocurrencies in portfolio"
            >
              {topMoversList.map((coin) => (
                <li key={coin.id}>
                  <Link
                    href={`/details/${coin.id}`}
                    className="flex items-center p-2 rounded-md border border-transparent hover:border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    {coin.image ? (
                      <img
                        src={coin.image}
                        alt={`${coin.name} logo`}
                        className="w-6 h-6 rounded-full mr-2 flex-shrink-0"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/placeholder-icon.svg";
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full mr-2 flex-shrink-0 bg-muted flex items-center justify-center">
                        <Bitcoin className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs group-hover:text-primary truncate">
                        {coin.name}
                      </div>
                      <div className="text-xs text-muted-foreground/80">
                        {coin.symbol}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <PriceChangeLabel
                        change={coin.changePct}
                        className="text-xs block"
                      />
                      <PriceChangeLabel
                        change={coin.changeAbs}
                        changeType="absolute"
                        prefix={coin.changeAbs >= 0 ? "+" : ""}
                        suffix=" USD"
                        className="text-[11px] text-muted-foreground/80"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              No price changes to display.
            </p>
          )}
        </div>
      </div>
    </DataCard>
  );
}
