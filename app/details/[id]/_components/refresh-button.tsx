"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching || isPending;

  const handleRefresh = () => {
    setIsFetching(true);
    startTransition(() => {
      router.refresh();
      setIsFetching(false);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isMutating}
      className="text-muted-foreground hover:text-foreground border border-gray-300 rounded-md"
      aria-label="Refresh data"
    >
      <RefreshCw
        className={`h-4 w-4 mr-2 ${isMutating ? "animate-spin" : ""}`}
      />
      {isMutating ? "Refreshing..." : "Refresh"}
    </Button>
  );
}
