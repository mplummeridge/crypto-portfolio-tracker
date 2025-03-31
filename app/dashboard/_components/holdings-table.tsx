"use client";

import PriceChangeLabel from "@/components/ui/price-change-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProcessedHolding } from "@/hooks/usePortfolioData"; // Use import type
import { getAssetColor } from "@/lib/colors";
import { usePortfolioStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import React from "react";

interface HoldingsTableProps {
  table: TanstackTable<ProcessedHolding>; // Pass the table instance
}

export function HoldingsTable({ table }: HoldingsTableProps) {
  const hoveredSymbol = usePortfolioStore((state) => state.hoveredSymbol);
  const setHoveredSymbol = usePortfolioStore((state) => state.setHoveredSymbol);
  const columns = table.getAllColumns(); // Get columns from table instance if needed

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-2 md:px-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  onMouseEnter={() => setHoveredSymbol(row.original.symbol)}
                  onMouseLeave={() => setHoveredSymbol(null)}
                  style={{
                    backgroundColor:
                      row.original.symbol === hoveredSymbol
                        ? getAssetColor(row.original.symbol, 0.1)
                        : "transparent",
                  }}
                  className="transition-colors duration-100 ease-in-out"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 md:px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Conditional Expanded Row Content */}
                {row.getIsExpanded() && (
                  <TableRow
                    key={`${row.id}-expanded`}
                    data-state="expanded"
                    style={{
                      backgroundColor:
                        row.original.symbol === hoveredSymbol
                          ? getAssetColor(row.original.symbol, 0.1)
                          : "transparent",
                    }}
                    className="transition-colors duration-100 ease-in-out"
                  >
                    <TableCell
                      colSpan={row.getVisibleCells().length}
                      className="p-2 bg-muted/50"
                    >
                      <div className="flex justify-between items-center text-xs px-2">
                        <div>
                          <span className="font-medium">Price:</span>{" "}
                          {formatCurrency(row.original.currentPrice)}
                        </div>
                        <PriceChangeLabel change={row.original.changePct24h} />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No holdings yet. Add your first one!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
