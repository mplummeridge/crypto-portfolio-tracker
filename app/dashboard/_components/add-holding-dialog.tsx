"use client";

import AddHoldingButton from "@/components/add-holding-button";
import HoldingForm from "@/components/holding-form";
import ResponsiveDialog from "@/components/responsive-dialog";
import { toast } from "@/components/ui/use-toast";
import { usePortfolioStore } from "@/lib/store";

export function AddHoldingDialog() {
  const {
    isAddHoldingDialogOpen,
    openAddHoldingDialog,
    closeAddHoldingDialog,
  } = usePortfolioStore();

  const handleAddHolding = () => {
    openAddHoldingDialog();
  };

  const handleClosePanel = () => {
    closeAddHoldingDialog();
  };

  const handleHoldingAdded = () => {
    closeAddHoldingDialog();
    toast({
      title: "Success!",
      description: "Holding added to your portfolio.",
      variant: "default",
    });
  };

  return (
    <>
      <div className="hidden md:block">
        <AddHoldingButton onClick={handleAddHolding} />
      </div>

      <ResponsiveDialog
        isOpen={isAddHoldingDialogOpen}
        onClose={handleClosePanel}
        title="Add New Holding"
        role="dialog"
        aria-labelledby="add-holding-dialog-title"
      >
        <HoldingForm
          onSuccess={handleHoldingAdded}
          onCancel={handleClosePanel}
        />
      </ResponsiveDialog>
    </>
  );
}
