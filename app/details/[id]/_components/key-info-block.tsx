import { Badge } from "@/components/ui/badge";
import { DataCard } from "@/components/ui/data-card";
import MarketStat from "@/components/ui/market-stat";
import { formatDate, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ExtendedCryptoDetails } from "@/types/crypto";
import { Activity, BadgeCheck, Calendar, Hash, Info } from "lucide-react";
import React from "react";

interface KeyInfoBlockProps {
  detailsData: ExtendedCryptoDetails;
}

/**
 * Server Component: Displays key informational points about the asset.
 */
export function KeyInfoBlock({ detailsData }: KeyInfoBlockProps) {
  const {
    genesis_date,
    watchlist_portfolio_users,
    hashing_algorithm,
    ASSET_ISSUER_NAME,
    SUPPLY_ISSUED,
    SUPPLY_LOCKED,
    ASSET_SECURITY_METRICS,
    ASSET_CUSTODIANS,
    symbol, // For supply display
  } = detailsData;

  const displaySymbol = symbol || "";
  const securityMetric = ASSET_SECURITY_METRICS?.[0];

  // Check if there's any data to display in the main block or custodians section
  const hasKeyInfo =
    genesis_date ||
    watchlist_portfolio_users ||
    hashing_algorithm ||
    ASSET_ISSUER_NAME ||
    SUPPLY_ISSUED ||
    SUPPLY_LOCKED ||
    securityMetric;
  const hasCustodians = ASSET_CUSTODIANS && ASSET_CUSTODIANS.length > 0;

  if (!hasKeyInfo && !hasCustodians) {
    return null;
  }

  return (
    <DataCard title="Key Information">
      {/* Main Key Info Grid */}
      {hasKeyInfo && (
        <div className="grid grid-cols-1 gap-y-4 text-sm mb-6">
          {genesis_date && (
            <MarketStat
              label="Genesis Date"
              value={formatDate(genesis_date)}
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            />
          )}
          {watchlist_portfolio_users && watchlist_portfolio_users > 0 && (
            <MarketStat
              label="Watchlist Users"
              value={formatNumber(watchlist_portfolio_users, 0)}
              icon={<BadgeCheck className="h-4 w-4 text-muted-foreground" />}
            />
          )}
          {hashing_algorithm && (
            <MarketStat
              label="Hashing Algorithm"
              value={hashing_algorithm}
              icon={<Hash className="h-4 w-4 text-muted-foreground" />}
              valueClassName="truncate"
              title={hashing_algorithm}
            />
          )}
          {ASSET_ISSUER_NAME && (
            <MarketStat
              label="Issuer"
              value={ASSET_ISSUER_NAME}
              icon={<Info className="h-4 w-4 text-muted-foreground" />}
              valueClassName="truncate"
              title={ASSET_ISSUER_NAME}
            />
          )}
          {typeof SUPPLY_ISSUED === "number" && SUPPLY_ISSUED > 0 && (
            <MarketStat
              label="Issued Supply"
              value={`${formatNumber(SUPPLY_ISSUED, 0)} ${displaySymbol}`}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
          )}
          {typeof SUPPLY_LOCKED === "number" && SUPPLY_LOCKED > 0 && (
            <MarketStat
              label="Locked Supply"
              value={`${formatNumber(SUPPLY_LOCKED, 0)} ${displaySymbol}`}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
          )}
          {securityMetric?.OVERALL_SCORE && (
            <MarketStat
              label={securityMetric.NAME || "Security Score"}
              value={securityMetric.OVERALL_SCORE.toFixed(1)}
              icon={<BadgeCheck className="h-4 w-4 text-muted-foreground" />}
            />
          )}
        </div>
      )}

      {/* Custodians Section */}
      {hasCustodians && (
        <div className={cn("pt-4", hasKeyInfo && "border-t")}>
          {" "}
          {/* Add border only if key info exists above */}
          <h4 className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
            Custodians
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {ASSET_CUSTODIANS.map((custodian: { NAME: string }) => (
              <Badge
                key={custodian.NAME}
                variant="secondary"
                className="text-xs px-1.5 py-0.5"
              >
                {custodian.NAME.replace(/_/g, " ").replace(
                  /\b\w/g,
                  (l: string) => l.toUpperCase(),
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </DataCard>
  );
}
