"use client";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

// Define size variants using cva
const imageVariants = cva(
  "rounded-full flex items-center justify-center font-bold flex-shrink-0",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Extend props with cva variants
interface CoinIdentifierProps extends VariantProps<typeof imageVariants> {
  name: string;
  symbol: string;
  imageUrl?: string | null;
  nameClassName?: string;
  symbolClassName?: string;
  containerClassName?: string;
  className?: string;
}

function CoinIdentifier({
  name,
  symbol,
  imageUrl,
  size,
  nameClassName = "text-xl font-semibold",
  symbolClassName = "text-xs text-muted-foreground",
  containerClassName = "flex items-center gap-3",
  className,
}: CoinIdentifierProps) {
  const [showFallback, setShowFallback] = React.useState(!imageUrl);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Hide image element completely if not using fallbacks
    e.currentTarget.style.display = "none";
    // Switch to showing fallback initials
    setShowFallback(true);
    // Prevent infinite error loops if fallback also somehow fails
    e.currentTarget.onerror = null;
  };

  // Reset fallback state if imageUrl changes
  React.useEffect(() => {
    setShowFallback(!imageUrl);
  }, [imageUrl]);

  const initials =
    symbol?.slice(0, 2).toUpperCase() || name?.slice(0, 1).toUpperCase() || "?";

  const imageClasses = imageVariants({ size });

  return (
    <div className={cn(containerClassName, className)}>
      {showFallback ? (
        <span
          className={cn(imageClasses, "bg-gray-100 dark:bg-gray-800")}
          aria-label={`${name} initials`}
        >
          {initials}
        </span>
      ) : (
        <img
          src={imageUrl || ""}
          alt={`${name} logo`}
          className={cn(imageClasses)}
          onError={handleError}
          loading="lazy"
        />
      )}
      <div>
        <div className={cn(nameClassName)}>{name}</div>
        <div className={cn(symbolClassName)}>{symbol}</div>
      </div>
    </div>
  );
}

export default CoinIdentifier;
