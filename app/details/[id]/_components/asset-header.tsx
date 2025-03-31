import { Badge } from "@/components/ui/badge";
import CoinIdentifier from "@/components/ui/coin-identifier";
import { DataCard } from "@/components/ui/data-card";
import { formatNumber } from "@/lib/utils";
import type { ExtendedCryptoDetails } from "@/types/crypto";

interface AssetHeaderProps {
  detailsData: ExtendedCryptoDetails;
}

/**
 * Server Component: Displays the main asset identification, price, and rank/badges.
 */
export function AssetHeader({ detailsData }: AssetHeaderProps) {
  const {
    name,
    symbol,
    image,
    market_cap_rank,
    market_data,
    ASSET_TYPE,
    ASSET_INDUSTRIES,
  } = detailsData;

  const displayName = name || "Unknown Asset";
  const displaySymbol = symbol || "";
  const displayImage = image;
  const displayPrice = market_data?.current_price?.usd ?? 0;
  const priceChange24h = market_data?.price_change_percentage_24h ?? 0;
  const displayRank = market_cap_rank
    ? `#${formatNumber(market_cap_rank, 0)}`
    : "#N/A";

  return (
    <DataCard cardClassName="overflow-visible" contentClassName="p-0">
      <div className="px-4 md:px-6 pt-4">
        {" "}
        <div className="flex flex-row justify-between items-start mb-4 gap-x-4">
          {/* Asset Identification */}
          <CoinIdentifier
            name={displayName}
            symbol={displaySymbol}
            imageUrl={displayImage}
            size="lg"
          />

          {/* Rank & Badges */}
          <div className="text-right shrink-0">
            {market_cap_rank !== null && market_cap_rank !== undefined && (
              <div className="text-xs text-muted-foreground mb-1">
                Rank {displayRank}
              </div>
            )}
            {/* Align badges to the end (right) */}
            <div className="mt-1 flex flex-wrap justify-end gap-1 max-w-[150px] sm:max-w-xs">
              {ASSET_TYPE && (
                <Badge variant="outline" className="text-xs">
                  {ASSET_TYPE}
                </Badge>
              )}
              {ASSET_INDUSTRIES?.map(
                (ind: { ASSET_INDUSTRY: string; JUSTIFICATION?: string }) => (
                  <Badge
                    key={ind.ASSET_INDUSTRY}
                    variant="secondary"
                    className="text-xs whitespace-nowrap"
                  >
                    {ind.ASSET_INDUSTRY.replace(/_/g, " ").replace(
                      /\b\w/g,
                      (l: string) => l.toUpperCase(),
                    )}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </DataCard>
  );
}
