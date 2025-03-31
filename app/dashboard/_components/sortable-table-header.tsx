import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type React from "react";

interface SortableTableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
  className?: string;
}

export function SortableTableHeader<TData, TValue>({
  column,
  children,
  className,
}: SortableTableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={className}
    >
      {children}
      {/* Add conditional rendering for sort icons */}
      <span className="ml-1.5">
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4 opacity-70" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4 opacity-70" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-30" /> // Dim default icon
        )}
      </span>
    </Button>
  );
}
