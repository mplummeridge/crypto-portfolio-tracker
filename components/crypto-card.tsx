"use client";

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
import { usePortfolioStore } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { CryptoHolding } from "@/types/holding";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Coins,
  Edit,
  MoreHorizontal,
  Trash2,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ExtendedCryptoHolding extends CryptoHolding {
  changePct24h?: number;
  image?: string;
  changeAbs24h?: number;
  high24h?: number;
  low24h?: number;
  marketCap?: number;
  volume24h?: number;
}

interface CryptoCardProps {
  holding: ExtendedCryptoHolding;
}

export default function CryptoCard({ holding }: CryptoCardProps) {
  const { removeHolding } = usePortfolioStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const totalValue = holding.quantity * holding.currentPrice;
  const priceChange24h = holding.changePct24h ?? 0;
  const priceChangeAbs24h = holding.changeAbs24h ?? 0;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditPanel(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    removeHolding(holding.id);
    setShowDeleteDialog(false);
  };

  const handleEditSuccess = () => {
    setShowEditPanel(false);
  };

  return (
    <>
      <Card
        className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden rounded-lg"
        role="article"
        aria-label={`${holding.name} (${holding.symbol}) holding details`}
      >
        <Link
          href={`/details/${holding.id}`}
          className="absolute inset-0 z-0 focus:outline-none rounded-lg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <span className="sr-only">View details for {holding.name}</span>
        </Link>

        <div className="relative z-10 p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {holding.image ? (
                <img
                  src={holding.image}
                  alt={`${holding.name} logo`}
                  className="w-10 h-10 rounded-full flex-none"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder-icon.svg";
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex-none bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{holding.name}</h3>
                <div className="text-xs text-muted-foreground">
                  {holding.symbol}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="text-right">
                <div
                  className="font-semibold text-lg"
                  role="status"
                  aria-live="polite"
                >
                  {formatCurrency(totalValue)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatNumber(holding.quantity)} {holding.symbol}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 relative z-10"
                    aria-label={`Actions for ${holding.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                  role="menu"
                  aria-label={`Actions for ${holding.name}`}
                >
                  <DropdownMenuItem
                    onClick={handleEdit}
                    role="menuitem"
                    aria-label={`Edit ${holding.name} holding`}
                  >
                    <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Edit Holding</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 dark:text-red-400"
                    role="menuitem"
                    aria-label={`Remove ${holding.name} holding`}
                  >
                    <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Remove</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex justify-between items-end text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-semibold text-base">
                {formatCurrency(holding.currentPrice)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex flex-col items-end">
                <PriceChangeLabel
                  change={priceChange24h}
                  className="flex items-center"
                />
                <PriceChangeLabel
                  change={priceChangeAbs24h}
                  changeType="absolute"
                  prefix={priceChangeAbs24h >= 0 ? "+" : ""}
                  suffix=" USD"
                  className="flex items-center text-xs text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <ResponsiveDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Holding"
        role="alertdialog"
        aria-modal={true}
        aria-labelledby="delete-dialog-title"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground" id="delete-dialog-title">
            Are you sure you want to remove {holding.name} from your portfolio?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              aria-label="Cancel deletion"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              aria-label={`Confirm deletion of ${holding.name}`}
            >
              Delete
            </Button>
          </div>
        </div>
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={showEditPanel}
        onClose={() => setShowEditPanel(false)}
        title="Edit Holding"
        role="dialog"
        aria-modal={true}
        aria-labelledby="edit-dialog-title"
      >
        <HoldingForm initialData={holding} onSuccess={handleEditSuccess} />
      </ResponsiveDialog>
    </>
  );
}
