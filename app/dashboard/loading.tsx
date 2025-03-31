import { MainContainer } from "@/components/layout/main-container";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoldingsListSkeleton,
  PortfolioActivitySkeleton,
  PortfolioDistributionSkeleton,
  PortfolioValueSkeleton,
} from "./_components/dashboard-skeletons";

export default function Loading() {
  // Top-level dashboard skeleton structure
  return (
    <MainContainer>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="hidden md:block h-10 w-36 rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
        {/* Main Column Skeleton */}
        <main className="xl:col-span-2 space-y-4 xl:space-y-6">
          <PortfolioValueSkeleton />
          <HoldingsListSkeleton />
        </main>

        {/* Sidebar Skeleton */}
        <aside className="xl:col-span-1 space-y-4 xl:space-y-6">
          <PortfolioDistributionSkeleton />
          <PortfolioActivitySkeleton />
        </aside>
      </div>

      {/* Mobile Button Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 md:hidden">
        <Skeleton className="h-12 rounded-md w-full" />
      </div>
    </MainContainer>
  );
}
