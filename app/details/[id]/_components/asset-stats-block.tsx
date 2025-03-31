import { DataCard } from "@/components/ui/data-card";
import MarketStat from "@/components/ui/market-stat";
import PriceChangeLabel from "@/components/ui/price-change-label";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { ExtendedCryptoDetails } from "@/types/crypto";
import { Activity } from "lucide-react";
import type React from "react";

interface AssetStatsBlockProps {
  detailsData: ExtendedCryptoDetails;
  footerContent?: React.ReactNode;
}

/**
 * Server Component: Displays key market statistics like price, change, market cap, volume, supply.
 * Optionally renders provided content in its footer.
 */
export function AssetStatsBlock({
  detailsData,
  footerContent,
}: AssetStatsBlockProps) {
  const { symbol, market_data, SUPPLY_TOTAL, TOPLIST_BASE_RANK } = detailsData;

  const displaySymbol = symbol || "";
  const displayPrice = market_data?.current_price?.usd ?? 0;
  const priceChange24h = market_data?.price_change_percentage_24h ?? 0;
  const priceChange7d = market_data?.price_change_percentage_7d ?? 0;
  const priceChange30d = market_data?.price_change_percentage_30d;
  const marketCap = market_data?.market_cap?.usd ?? 0;
  const tradingVolume = market_data?.total_volume?.usd ?? 0;
  const circulatingSupply = market_data?.circulating_supply ?? 0;
  const totalSupply = SUPPLY_TOTAL;
  const volumeRank24h = TOPLIST_BASE_RANK?.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD;
  const totalMarketCapRank = TOPLIST_BASE_RANK?.TOTAL_MKT_CAP_USD;

  return (
    <DataCard
      contentClassName="p-0"
      footerContent={footerContent}
      footerClassName="p-0 bg-muted/40 dark:bg-muted/20"
      cardClassName={footerContent ? "rounded-b-none" : ""}
    >
      <div className="px-4 md:px-6 pb-4 md:pb-6">
        {" "}
        <div className="text-center my-4">
          {" "}
          <div className="text-3xl font-bold tracking-tight">
            {formatCurrency(displayPrice)}
          </div>
          {priceChange24h !== 0 && (
            <PriceChangeLabel
              change={priceChange24h}
              labelSuffix="(24h)"
              className="text-sm mt-1 font-medium"
            />
          )}
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs border-t border-gray-100 dark:border-gray-800 pt-4">
          {/* Left Column */}
          <div className="space-y-3">
            <MarketStat
              label="Market Cap"
              value={formatCurrency(marketCap, true)}
            />
            <MarketStat
              label="24h Trading Vol"
              value={formatCurrency(tradingVolume, true)}
            />
            <MarketStat
              label="Circulating Supply"
              value={
                circulatingSupply > 0
                  ? `${formatNumber(circulatingSupply, 0)} ${displaySymbol}`
                  : "N/A"
              }
            />
            {typeof totalSupply === "number" && totalSupply > 0 && (
              <MarketStat
                label="Total Supply"
                value={`${formatNumber(totalSupply, 0)} ${displaySymbol}`}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-3 md:border-l md:pl-6 md:pt-0 pt-3 border-t md:border-t-0">
            {/* Display 7d Change using PriceChangeLabel if available, else MarketStat N/A */}
            {typeof priceChange7d === "number" ? (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 inline-block" /> 7d Change
                </span>
                <PriceChangeLabel
                  change={priceChange7d}
                  className="font-semibold"
                />
              </div>
            ) : (
              <MarketStat
                label="7d Change"
                value="N/A"
                icon={
                  <Activity className="h-3.5 w-3.5 inline-block text-muted-foreground" />
                }
              />
            )}
            {/* Display 30d Change using PriceChangeLabel if available, else MarketStat N/A */}
            {typeof priceChange30d === "number" ? (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 inline-block" /> 30d Change
                </span>
                <PriceChangeLabel
                  change={priceChange30d}
                  className="font-semibold"
                />
              </div>
            ) : (
              <MarketStat
                label="30d Change"
                value="N/A"
                icon={
                  <Activity className="h-3.5 w-3.5 inline-block text-muted-foreground" />
                }
              />
            )}
            {totalMarketCapRank && (
              <MarketStat
                label="Market Cap Rank" // Simplified label
                value={`#${totalMarketCapRank}`}
              />
            )}
            {volumeRank24h && (
              <MarketStat label="24h Volume Rank" value={`#${volumeRank24h}`} />
            )}
          </div>
        </div>
      </div>
    </DataCard>
  );
}
