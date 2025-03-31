import { Wallet } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { MainContainer } from "@/components/layout/main-container";
import { fetchCryptoPricesBulk } from "@/lib/data/crypto";
import { fetchHoldings } from "@/lib/data/portfolio";
import type { CryptoComparePriceData } from "@/types/api/cryptocompare";
import type { InitialHolding } from "@/types/holding";

import {
  HoldingsListSkeleton,
  PortfolioActivitySkeleton,
  PortfolioDistributionSkeleton,
  PortfolioValueSkeleton,
} from "./dashboard/_components/dashboard-skeletons";

import { AddHoldingDialog } from "./dashboard/_components/add-holding-dialog";
import { HoldingsList } from "./dashboard/_components/holdings-list";
import { MobileAddHoldingButtonWrapper } from "./dashboard/_components/mobile-add-holding-button";
import { PortfolioActivity } from "./dashboard/_components/portfolio-activity";
import { PortfolioDistribution } from "./dashboard/_components/portfolio-distribution";
import { PortfolioValueCard } from "./dashboard/_components/portfolio-value-card";

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Track and manage your cryptocurrency portfolio.",
};

export default async function Home() {
  const initialHoldings: InitialHolding[] = await fetchHoldings();

  const holdingIds = Array.from(new Set(initialHoldings.map((h) => h.id)));

  let initialPrices: Record<string, CryptoComparePriceData | null> = {};
  if (holdingIds.length > 0) {
    initialPrices = await fetchCryptoPricesBulk(holdingIds);
  }

  return (
    <MainContainer>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full"
            role="img"
            aria-label="Wallet icon"
          >
            <Wallet
              className="h-5 w-5 text-blue-500 dark:text-blue-400"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
            Crypto Dashboard
          </h1>
        </div>
        <AddHoldingDialog />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
        <main className="xl:col-span-2 space-y-4 xl:space-y-6">
          <Suspense fallback={<PortfolioValueSkeleton />}>
            <PortfolioValueCard />
          </Suspense>

          <Suspense fallback={<HoldingsListSkeleton />}>
            <HoldingsList />
          </Suspense>
        </main>

        <aside className="xl:col-span-1 space-y-4 xl:space-y-6">
          <Suspense fallback={<PortfolioDistributionSkeleton />}>
            <PortfolioDistribution />
          </Suspense>

          <Suspense fallback={<PortfolioActivitySkeleton />}>
            <PortfolioActivity />
          </Suspense>
        </aside>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-gray-100 via-gray-100/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 backdrop-blur-sm md:hidden"
        aria-label="Mobile Add Holding Button Container"
      >
        <MobileAddHoldingButtonWrapper />
      </div>
    </MainContainer>
  );
}
