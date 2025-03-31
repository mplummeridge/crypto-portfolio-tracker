"use client";

import {
  type ColumnDef,
  type ExpandedState,
  type VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useCallback, useEffect, useMemo, useState } from "react";

import HoldingForm from "@/components/holding-form";
import ResponsiveDialog from "@/components/responsive-dialog";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PriceChangeLabel from "@/components/ui/price-change-label";

import {
  type ProcessedHolding,
  usePortfolioData,
} from "@/hooks/usePortfolioData";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

import { type OrderedHoldingData, usePortfolioStore } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/utils";

import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Coins,
  Edit,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { HoldingsListSkeleton } from "./dashboard-skeletons";
import { HoldingsListFilter } from "./holdings-list-filter";
import { HoldingsTable } from "./holdings-table";
import { SortableTableHeader } from "./sortable-table-header";

/**
 * Displays the user's cryptocurrency holdings in an interactive table.
 * Features include sorting, global filtering, responsive column visibility,
 * expanding rows on mobile, and actions to edit or delete holdings.
 * Handles loading and error states for the underlying portfolio data.
 */
export function HoldingsList() {
  const { removeHolding, setOrderedHoldings, tableSorting, setTableSorting } =
    usePortfolioStore();

  const tableGlobalFilter = usePortfolioStore(
    (state) => state.tableGlobalFilter,
  );

  const { processedHoldings, isLoading, isError, error } = usePortfolioData();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [selectedHolding, setSelectedHolding] =
    useState<ProcessedHolding | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const isMobile = useMediaQuery("(max-width: 767px)");
  useEffect(() => {
    if (isMobile) {
      setColumnVisibility({
        currentPrice: false,
        changePct24h: false,
        expander: true,
      });
    } else {
      setColumnVisibility({ expander: false });
    }
  }, [isMobile]);

  const handleEdit = useCallback((holding: ProcessedHolding) => {
    setSelectedHolding(holding);
    setShowEditPanel(true);
  }, []);

  const handleDelete = useCallback((holding: ProcessedHolding) => {
    setSelectedHolding(holding);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = () => {
    if (selectedHolding) {
      removeHolding(selectedHolding.id);
      setShowDeleteDialog(false);
      setSelectedHolding(null);
    }
  };

  const handleEditSuccess = () => {
    setShowEditPanel(false);
    setSelectedHolding(null);
  };

  const columns = useMemo<ColumnDef<ProcessedHolding>[]>(
    () => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
            className="h-8 w-8 p-0 data-[state=open]:bg-muted lg:hidden"
            data-state={row.getIsExpanded() ? "open" : "closed"}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">
              {row.getIsExpanded() ? "Collapse row" : "Expand row"}
            </span>
          </Button>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortableTableHeader column={column} className="-ml-4 group">
            Name
          </SortableTableHeader>
        ),
        cell: ({ row }) => {
          const holding = row.original;
          return (
            <Link
              href={`/details/${holding.id}`}
              className="flex items-center gap-3 group hover:cursor-pointer"
            >
              {holding.image ? (
                <img
                  src={holding.image}
                  alt={`${holding.name} logo`}
                  className="w-8 h-8 rounded-full flex-none"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder-icon.svg";
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex-none bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate group-hover:text-primary">
                  {holding.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {holding.symbol}
                </div>
              </div>
            </Link>
          );
        },
        enableGlobalFilter: true,
        enableHiding: false,
      },
      {
        accessorKey: "currentPrice",
        header: ({ column }) => (
          <SortableTableHeader
            column={column}
            className="-ml-4 group hidden md:inline-flex"
          >
            Price
          </SortableTableHeader>
        ),
        cell: ({ row }) => (
          <div className="hidden md:block font-medium">
            {formatCurrency(row.getValue("currentPrice"))}
          </div>
        ),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: "changePct24h",
        header: ({ column }) => (
          <SortableTableHeader
            column={column}
            className="-ml-4 group hidden md:inline-flex"
          >
            24h Change
          </SortableTableHeader>
        ),
        cell: ({ row }) => {
          const holding = row.original;
          return (
            <div className="hidden md:block">
              <PriceChangeLabel change={holding.changePct24h} />
              <PriceChangeLabel
                change={holding.changeAbs24h ?? 0}
                changeType="absolute"
                prefix={(holding.changeAbs24h ?? 0) >= 0 ? "+" : ""}
                suffix=" USD"
                className="text-[10px] text-muted-foreground block"
              />
            </div>
          );
        },
        enableSorting: true,
        sortingFn: "basic",
        enableHiding: true,
      },
      {
        accessorKey: "value",
        header: ({ column }) => (
          <SortableTableHeader
            column={column}
            className="-ml-4 group text-right w-full justify-end"
          >
            Value
          </SortableTableHeader>
        ),
        cell: ({ row }) => {
          const holding = row.original;
          return (
            <div className="text-right">
              <div className="font-medium">{formatCurrency(holding.value)}</div>
              <div className="text-xs text-muted-foreground">
                {formatNumber(holding.quantity)} {holding.symbol}
              </div>
            </div>
          );
        },
        enableSorting: true,
        sortingFn: "basic",
        enableHiding: false,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const holding = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(holding)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(holding)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableHiding: false,
      },
    ],
    [handleEdit, handleDelete],
  );

  const table = useReactTable({
    data: processedHoldings,
    columns,
    state: {
      sorting: tableSorting,
      globalFilter: tableGlobalFilter,
      columnVisibility,
      expanded,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(tableSorting) : updater;
      setTableSorting(newSorting);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const rows = table.getRowModel().rows;

  useEffect(() => {
    const ordered: OrderedHoldingData[] = rows.map((row) => ({
      id: row.original.id,
      symbol: row.original.symbol,
      name: row.original.name,
      image: row.original.image,
    }));
    setOrderedHoldings(ordered);
  }, [rows, setOrderedHoldings]);

  if (isLoading) {
    return <HoldingsListSkeleton />;
  }

  if (isError) {
    return (
      <Card className="h-64 flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Portfolio</h3>
        <p className="text-muted-foreground mb-4">
          Could not load portfolio data.{" "}
          {error?.message || "Please try refreshing the page."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">My Holdings</h2>
        <HoldingsListFilter />
      </div>

      <HoldingsTable table={table} />

      <ResponsiveDialog
        isOpen={showEditPanel}
        onClose={() => setShowEditPanel(false)}
        title={`Edit ${selectedHolding?.name ?? "Holding"}`}
      >
        {selectedHolding && (
          <HoldingForm
            initialData={selectedHolding}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditPanel(false)}
          />
        )}
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Holding"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove {selectedHolding?.name} (
            {selectedHolding?.symbol}) from your portfolio? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </Card>
  );
}
