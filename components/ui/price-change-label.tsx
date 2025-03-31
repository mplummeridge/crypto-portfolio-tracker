import { cn, formatCurrency } from "@/lib/utils";
import type React from "react";

interface PriceChangeLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  change: number | null | undefined;
  labelSuffix?: string;
  digits?: number;
  changeType?: "percent" | "absolute";
  prefix?: string;
  suffix?: string;
}

function PriceChangeLabel({
  change,
  labelSuffix,
  digits = 2,
  changeType = "percent",
  prefix = "",
  suffix = "",
  className,
  ...props
}: PriceChangeLabelProps) {
  if (change === null || change === undefined || Number.isNaN(change)) {
    return (
      <span className={cn("text-muted-foreground", className)} {...props}>
        N/A
      </span>
    );
  }

  const isPositive = change >= 0;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";

  let formattedChange: string;

  if (changeType === "absolute") {
    formattedChange = formatCurrency(change, false);
  } else {
    const sign = isPositive ? "+" : "";
    formattedChange = `${sign}${change.toFixed(digits)}%`;
  }

  return (
    <span className={cn(colorClass, className)} {...props}>
      {prefix}
      {formattedChange}
      {suffix}
      {labelSuffix && (
        <span className="text-xs text-muted-foreground ml-1">
          {labelSuffix}
        </span>
      )}
    </span>
  );
}

export default PriceChangeLabel;
