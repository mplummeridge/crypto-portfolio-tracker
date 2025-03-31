"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { usePortfolioStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Coins } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderedHoldingData {
  id: string;
  name: string;
  symbol: string;
  image?: string;
}

interface DetailsNavigationProps {
  currentCoinId: string;
}

const NavLinkContent = ({ holding }: { holding: OrderedHoldingData }) => (
  <div className="flex items-center opacity-60 group-hover:opacity-100 transition-opacity duration-200">
    {holding.image ? (
      <img
        src={holding.image}
        alt={`${holding.name} logo`}
        className="w-5 h-5 rounded-full flex-none"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/placeholder-icon.svg";
        }}
      />
    ) : (
      <div className="w-5 h-5 rounded-full flex-none bg-muted flex items-center justify-center">
        <Coins className="w-3 h-3 text-muted-foreground" />
      </div>
    )}
    <span className="text-xs font-medium inline ml-1">
      {holding.name}
    </span>
  </div>
);

export function DetailsNavigation({ currentCoinId }: DetailsNavigationProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const { orderedHoldings } = usePortfolioStore((state) => ({
    orderedHoldings: state.orderedHoldings,
  }));

  const currentIndex = orderedHoldings.findIndex((h) => h.id === currentCoinId);
  const previousHolding =
    currentIndex > 0 ? orderedHoldings[currentIndex - 1] : null;
  const nextHolding =
    currentIndex < orderedHoldings.length - 1
      ? orderedHoldings[currentIndex + 1]
      : null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }
      let targetUrl: string | null = null;
      if (event.key === "ArrowLeft" && previousHolding) {
        targetUrl = `/details/${previousHolding.id}`;
      } else if (event.key === "ArrowRight" && nextHolding) {
        targetUrl = `/details/${nextHolding.id}`;
      }

      if (targetUrl) {
        setIsNavigating(true);
        router.push(targetUrl);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    setIsNavigating(false);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, previousHolding, nextHolding]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.shiftKey
    ) {
      setIsNavigating(true);
    }
  };

  if (orderedHoldings.length === 0 || currentIndex === -1) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2",
        isNavigating && "opacity-50 pointer-events-none",
      )}
    >
      <div className="flex justify-start text-left flex-1">
        {previousHolding ? (
          <Link
            href={`/details/${previousHolding.id}`}
            onClick={handleLinkClick}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 px-1 group",
            )}
            prefetch={true}
            title={`Previous: ${previousHolding.name}`}
            aria-disabled={isNavigating}
          >
            <ChevronLeft className="h-4 w-4 mr-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            <NavLinkContent holding={previousHolding} />
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex justify-end text-right flex-1">
        {nextHolding ? (
          <Link
            href={`/details/${nextHolding.id}`}
            onClick={handleLinkClick}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 px-1 group",
            )}
            prefetch={true}
            title={`Next: ${nextHolding.name}`}
            aria-disabled={isNavigating}
          >
            <NavLinkContent holding={nextHolding} />
            <ChevronRight className="h-4 w-4 ml-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
