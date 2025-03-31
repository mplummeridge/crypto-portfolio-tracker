import { Skeleton } from "@/components/ui/skeleton";
import { DataCard } from "../../../../components/ui/data-card"; // Corrected relative path (4 levels up)

/**
 * Skeleton placeholder for the Price Chart section.
 */
export function PriceChartSkeleton() {
  return (
    <DataCard
      headerContent={
        <div className="flex items-center justify-between gap-1">
          <Skeleton className="h-5 w-20" /> {/* Title placeholder */}
          {/* Timeframe buttons placeholder */}
          <div className="flex space-x-1 overflow-x-auto">
            <Skeleton className="h-6 w-8 rounded" />
            <Skeleton className="h-6 w-8 rounded" />
            <Skeleton className="h-6 w-8 rounded" />
            <Skeleton className="h-6 w-8 rounded" />
            <Skeleton className="h-6 w-8 rounded" />
          </div>
        </div>
      }
      contentClassName="pt-4 h-[200px] max-h-[200px]" // Match original chart height
      loadingHeight="h-full" // Make skeleton fill the content area
      isLoading={true} // Explicitly set isLoading for DataCard's skeleton display
    >
      {/* Children are ignored when isLoading is true in DataCard */}
      <></>
    </DataCard>
  );
}

/**
 * Skeleton placeholder for the Reserves Breakdown chart section.
 */
export function ReservesSkeleton() {
  return (
    <DataCard
      title={<Skeleton className="h-5 w-32" />} // Placeholder for title
      description={<Skeleton className="h-3 w-40 mt-1" />} // Placeholder for description
      contentClassName="p-4 pt-0"
      loadingHeight="h-[220px]" // Match original chart height
      isLoading={true}
    >
      <></>
    </DataCard>
  );
}

/**
 * Skeleton placeholder for the User Holding Controls section (often part of another card's footer).
 * This might be simpler, like just animating the footer area.
 */
export function UserHoldingSkeleton() {
  return (
    <div className="bg-muted/40 dark:bg-muted/20 p-4 md:px-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 rounded-b-lg w-full">
      {/* Left Side Skeleton */}
      <div className="flex items-center gap-2 overflow-hidden">
        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
        <div className="min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      </div>
      {/* Right Side Skeleton */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton for the entire Details Page (used in loading.tsx)
 */
function DetailsPageSkeleton() {
  return (
    <>
      {/* Top Bar Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-36" />
      </div>
      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Header Skeleton (Simulated using DataCard) */}
          <DataCard
            isLoading={true}
            loadingHeight="h-[80px]" // Approx height for header part
            contentClassName="p-0"
            cardClassName="overflow-visible"
          >
            <></>
          </DataCard>
          {/* Asset Stats Skeleton (Simulated using DataCard) */}
          <DataCard
            isLoading={true}
            loadingHeight="h-[180px]" // Approx height for stats part
            contentClassName="p-0"
          >
            <></>
          </DataCard>
          {/* User Holding Skeleton in its typical footer position */}
          <DataCard isLoading={true} loadingHeight="h-0">
            {" "}
            {/* Card structure w/o content */}
            <div className="border-t border-gray-100 dark:border-gray-800">
              <UserHoldingSkeleton />
            </div>
          </DataCard>
          <PriceChartSkeleton /> {/* Chart Skeleton */}
          <Skeleton className="h-40 w-full" />{" "}
          {/* Networks/About Placeholder */}
        </div>
        {/* Right Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <ReservesSkeleton /> {/* Reserves Skeleton */}
          <Skeleton className="h-[400px] w-full" />{" "}
          {/* Key Info/Links Placeholder */}
        </aside>
      </div>
    </>
  );
}
