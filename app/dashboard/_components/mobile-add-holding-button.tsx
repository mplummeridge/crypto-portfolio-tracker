"use client";

import AddHoldingButton from "@/components/add-holding-button";
import { usePortfolioStore } from "@/lib/store";

export function MobileAddHoldingButtonWrapper() {
  const { openAddHoldingDialog } = usePortfolioStore();

  return (
    <div className="w-full md:hidden">
      {" "}
      {/* Ensure it only shows on mobile */}
      <AddHoldingButton onClick={openAddHoldingDialog} />
    </div>
  );
}
