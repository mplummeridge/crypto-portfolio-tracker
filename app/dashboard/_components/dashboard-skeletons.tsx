import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PortfolioValueSkeleton = () => (
  <Card className="border-0 shadow-sm overflow-hidden rounded-xl">
    <CardContent className="p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-40 w-full" />
    </CardContent>
  </Card>
);

export const HoldingsListSkeleton = () => (
  // Container with filter/sort status placeholder
  <div className="space-y-4">
    {/* Skeleton for Filter Input */}
    <div className="flex items-center py-4">
      <Skeleton className="h-10 w-full max-w-sm" />
    </div>
    {/* Skeleton for Sort/Filter Badges Area */}
    <div className="h-8" /> {/* Simple height placeholder */}
    {/* Skeleton Table */}
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Approximate number of columns */}
            {/* Consider adjusting widths if necessary */}
            {/* Expander */}
            <TableHead className="w-[40px] px-1">
              <Skeleton className="h-5 w-full" />
            </TableHead>
            {/* Name */}
            <TableHead>
              <Skeleton className="h-5 w-20" />
            </TableHead>
            {/* Price */}
            <TableHead className="hidden md:table-cell">
              <Skeleton className="h-5 w-16" />
            </TableHead>
            {/* 24h Change */}
            <TableHead className="hidden md:table-cell">
              <Skeleton className="h-5 w-24" />
            </TableHead>
            {/* Value */}
            <TableHead>
              <Skeleton className="h-5 w-28" />
            </TableHead>
            {/* Actions */}
            <TableHead className="text-right">
              <Skeleton className="h-5 w-16" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
        </TableBody>
      </Table>
    </div>
  </div>
);

// Helper for a single skeleton table row
const SkeletonTableRow = () => (
  <TableRow>
    {/* Expander */}
    <TableCell className="px-1">
      <Skeleton className="h-8 w-8" />
    </TableCell>
    {/* Name */}
    <TableCell className="px-2 md:px-4 py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full flex-none" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </TableCell>
    {/* Price */}
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-5 w-full" />
    </TableCell>
    {/* 24h Change */}
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-5 w-full" />
    </TableCell>
    {/* Value */}
    <TableCell className="px-2 md:px-4 py-3">
      <div className="space-y-1.5 text-right">
        <Skeleton className="h-4 w-24 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </TableCell>
    {/* Actions */}
    <TableCell className="text-right px-2 md:px-4 py-3">
      <Skeleton className="h-8 w-8 ml-auto" />
    </TableCell>
  </TableRow>
);

export const PortfolioDistributionSkeleton = () => (
  <Card className="border-0 shadow-sm">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="w-full rounded h-[300px]" />
    </CardContent>
  </Card>
);

export const PortfolioActivitySkeleton = () => (
  <Card className="border-0 shadow-sm">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-1/3" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-4 w-1/4 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    </CardContent>
  </Card>
);
