import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExtendedCryptoDetails } from "@/types/crypto";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import ErrorBoundary from "@/components/error-boundary";
import { MainContainer } from "@/components/layout/main-container";
import { fetchCryptoDetails } from "@/lib/data/crypto";

import { AboutAsset } from "./_components/about-asset";
import { AssetHeader } from "./_components/asset-header";
import { AssetStatsBlock } from "./_components/asset-stats-block";
import { AvailableNetworks } from "./_components/available-networks";
import { DetailsNavigation } from "./_components/details-navigation";
import {
  PriceChartSkeleton,
  ReservesSkeleton,
} from "./_components/details-skeletons";
import { KeyInfoBlock } from "./_components/key-info-block";
import { LinksAccordion } from "./_components/links-accordion";
import { PriceChartSection } from "./_components/price-chart-section";
import { RefreshButton } from "./_components/refresh-button";
import { ReservesBreakdown } from "./_components/reserves-breakdown";
import { UserHoldingControls } from "./_components/user-holding-controls";

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const details = await fetchCryptoDetails(id);
    if (!details) {
      return { title: "Asset Not Found" };
    }
    return {
      title: `${details.name || "Asset"} Details (${details.symbol || id.toUpperCase()})`,
      description: `Detailed information and price chart for ${details.name || id}`,
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      title: `Details for ${id}`,
      description: `Loading details for ${id}`,
    };
  }
}

export default async function DetailsPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const coinId = resolvedParams.id;

  if (!coinId) {
    notFound();
  }

  let detailsData: ExtendedCryptoDetails | null = null;
  try {
    detailsData = await fetchCryptoDetails(coinId);
    if (!detailsData) {
      notFound();
    }
  } catch (error) {
    console.error("Failed to fetch details in Page:", error);
    throw new Error(
      `Failed to load data for ${coinId}. Please try again later.`,
    );
  }

  if (!detailsData) {
    console.error(`Data fetching succeeded but returned null for ${coinId}`);
    notFound();
  }

  const displayName = detailsData.name || "Unknown Asset";
  const displaySymbol = detailsData.symbol || "";

  return (
    <MainContainer>
      {/* Top Bar */}
      <div className="flex flex-row justify-between items-center mb-6 gap-x-2">
        {/* Back Link */}
        <div className="flex items-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "pl-0 whitespace-nowrap",
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Portfolio
          </Link>
          {/* Removed mobile refresh button container */}
        </div>

        {/* Navigation */}
        <div className="flex md:flex-grow">
          <DetailsNavigation currentCoinId={coinId} />
        </div>

        {/* Refresh Button */}
        <RefreshButton />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* --- Server Components --- */}
          <AssetHeader detailsData={detailsData} />
          <AssetStatsBlock
            detailsData={detailsData}
            footerContent={
              <ErrorBoundary
                fallback={
                  <div className="p-4 text-destructive text-sm">
                    Error loading holding info.
                  </div>
                }
              >
                {/* Render holding controls directly here, it handles its own null state */}
                <UserHoldingControls
                  coinId={coinId}
                  initialDetails={detailsData}
                />
              </ErrorBoundary>
            }
          />

          {/* --- Client Component (Suspense Wrapped) */}
          <ErrorBoundary
            fallback={
              <div className="p-4 border rounded bg-destructive/10 text-destructive text-sm h-[250px]">
                Error loading price chart.
              </div>
            }
          >
            <Suspense fallback={<PriceChartSkeleton />}>
              <PriceChartSection coinId={coinId} symbol={displaySymbol} />
            </Suspense>
          </ErrorBoundary>

          {/* --- Server Components --- */}
          {detailsData.ASSET_DESCRIPTION_SUMMARY && (
            <AboutAsset
              descriptionHtml={detailsData.ASSET_DESCRIPTION_SUMMARY}
              assetName={displayName}
            />
          )}
          {detailsData.SUPPORTED_PLATFORMS &&
            detailsData.SUPPORTED_PLATFORMS.length > 0 && (
              <AvailableNetworks platforms={detailsData.SUPPORTED_PLATFORMS} />
            )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* --- Client Component (Suspense Wrapped) */}
          {detailsData.RESERVES_BREAKDOWN &&
            detailsData.RESERVES_BREAKDOWN.length > 0 && (
              <ErrorBoundary
                fallback={
                  <div className="p-4 border rounded bg-destructive/10 text-destructive text-sm h-[250px]">
                    Error loading reserves data.
                  </div>
                }
              >
                <Suspense fallback={<ReservesSkeleton />}>
                  <ReservesBreakdown
                    breakdown={detailsData.RESERVES_BREAKDOWN}
                    assetName={displayName}
                  />
                </Suspense>
              </ErrorBoundary>
            )}

          {/* --- Server Components --- */}
          <KeyInfoBlock detailsData={detailsData} />
          <LinksAccordion details={detailsData} coinId={coinId} />
        </aside>
      </div>
    </MainContainer>
  );
}
