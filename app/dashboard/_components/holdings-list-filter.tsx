"use client";

import { Input } from "@/components/ui/input";
import { usePortfolioStore } from "@/lib/store";
import { Search } from "lucide-react";

export function HoldingsListFilter() {
  // Get filter state and setter from the store
  const { tableGlobalFilter, setTableGlobalFilter } = usePortfolioStore(
    (state) => ({
      tableGlobalFilter: state.tableGlobalFilter,
      setTableGlobalFilter: state.setTableGlobalFilter,
    }),
  );

  return (
    <div className="relative max-w-xs">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search holdings..."
        value={tableGlobalFilter ?? ""}
        onChange={(event) => setTableGlobalFilter(event.target.value)}
        className="pl-8 h-9"
        aria-label="Search holdings"
      />
    </div>
  );
}
