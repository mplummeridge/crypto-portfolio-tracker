"use client";

import HoldingForm from "@/components/holding-form";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { usePortfolioStore } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { ExtendedCryptoDetails } from "@/types/crypto";
import { Edit, Trash2, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserHoldingSkeleton } from "./details-skeletons"; // Import skeleton

interface UserHoldingControlsProps {
  coinId: string;
  initialDetails: ExtendedCryptoDetails;
}

/**
 * Client Component: Displays user's holding for the current asset
 * and provides Edit/Delete controls. Renders skeleton during hydration.
 */
export function UserHoldingControls({
  coinId,
  initialDetails,
}: UserHoldingControlsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isHydrated, setIsHydrated] = useState(false); // Hydration state
  const { holdings, removeHolding } = usePortfolioStore((state) => ({
    holdings: state.holdings,
    removeHolding: state.removeHolding,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set hydration flag after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Find the user's holding based on coinId from the Zustand store
  // Return undefined during hydration phase
  const userHolding = useMemo(() => {
    if (!isHydrated) return undefined; // Undefined means hydration not complete
    return holdings.find((h) => h.id === coinId) || null; // Null means hydrated, no holding found
  }, [holdings, coinId, isHydrated]);

  // Use server-fetched price initially, potentially update later if needed
  const currentPrice = initialDetails.market_data?.current_price?.usd ?? 0;
  const displaySymbol = initialDetails.symbol || coinId.toUpperCase();
  const displayName = initialDetails.name || "this asset";

  // Calculate derived values based on the holding and current price
  // Ensure userHolding is not undefined before accessing quantity
  const userQuantity = userHolding ? userHolding.quantity : 0;
  const userTotalValue = userQuantity * currentPrice;

  // Handlers
  const handleEdit = useCallback(() => {
    if (userHolding && userHolding.quantity > 0) {
      setIsEditing(true);
    }
  }, [userHolding]);

  const handleDelete = useCallback(() => {
    if (userHolding && userHolding.quantity > 0) {
      setIsDeleting(true);
    }
  }, [userHolding]);

  const handleDeleteConfirm = useCallback(() => {
    if (userHolding && userHolding.quantity > 0) {
      removeHolding(userHolding.id);
      toast({
        title: "Holding Removed",
        description: `Successfully removed ${displayName} from your portfolio.`,
      });
      router.push("/"); // Navigate back to portfolio after deletion
    }
    setIsDeleting(false); // Close the dialog
  }, [userHolding, removeHolding, toast, router, displayName]);

  const handleEditSuccess = useCallback(
    (updatedHolding?: ExtendedCryptoDetails) => {
      setIsEditing(false);
      toast({
        title: "Holding Updated",
        description: `Successfully updated your ${displayName} holding.`,
      });
    },
    [toast, displayName],
  );

  // Render skeleton if hydration isn't complete
  if (userHolding === undefined) {
    return <UserHoldingSkeleton />;
  }

  // Render null if hydrated but user doesn't hold this asset (or quantity is 0)
  if (!userHolding || userQuantity <= 0) {
    return null;
  }

  // Render the actual controls and dialogs if hydrated and holding exists
  return (
    <>
      {/* Holding Info Footer Section */}
      <div className="bg-muted/40 dark:bg-muted/20 p-4 md:px-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 w-full rounded-b-lg">
        {/* Left Side: Title and Holding Info */}
        <div className="flex items-center gap-2 overflow-hidden">
          <Wallet
            className="h-5 w-5 text-primary flex-shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <span className="font-medium text-sm text-primary block">
              Your Holdings
            </span>
            <div
              className="text-xs text-muted-foreground truncate"
              title={`${formatNumber(userQuantity)} ${displaySymbol} (${formatCurrency(userTotalValue)})`}
            >
              {formatNumber(userQuantity)} {displaySymbol} (
              {formatCurrency(userTotalValue)})
            </div>
          </div>
        </div>
        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleEdit}
                  aria-label={`Edit ${displayName} holding`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Holding</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                  aria-label={`Delete ${displayName} holding`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Holding</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Dialogs */}
      <ResponsiveDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Edit ${displayName} Holding`}
      >
        <HoldingForm initialData={userHolding} onSuccess={handleEditSuccess} />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Confirm Deletion"
      >
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove your
            <strong className="text-foreground">
              {" "}
              {formatNumber(userQuantity)} {displaySymbol}{" "}
            </strong>
            holding? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </>
  );
}
