import { cn } from "@/lib/utils";
import type React from "react";

interface MarketStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
  iconClassName?: string;
}

function MarketStat({
  label,
  value,
  icon,
  labelClassName = "text-xs text-muted-foreground",
  valueClassName = "font-semibold",
  iconClassName = "h-4 w-4 text-muted-foreground",
  className,
  ...props
}: MarketStatProps) {
  return (
    <div
      className={cn("flex justify-between items-center", className)}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className={cn(iconClassName, "flex-shrink-0")}>{icon}</span>
        )}
        <span className={cn(labelClassName)}>{label}</span>
      </div>
      <span className={cn(valueClassName)}>{value}</span>
    </div>
  );
}

export default MarketStat;
