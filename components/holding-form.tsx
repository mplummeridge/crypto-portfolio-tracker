"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddHoldingMutation,
  useCryptoList,
  useUpdateHoldingMutation,
} from "@/hooks/useCryptoData";
import { usePortfolioStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { CryptoHolding } from "@/types/holding";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  cryptoApiId: z.string({
    required_error: "Please select a cryptocurrency",
  }),
  quantity: z
    .string()
    .min(1, "Please enter a quantity")
    .refine(
      (val) => {
        const num = Number.parseFloat(val);
        return !Number.isNaN(num) && num > 0;
      },
      { message: "Must be a positive number" },
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface HoldingFormProps {
  initialData?: CryptoHolding;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CryptoListData {
  id: string; // This is the API ID (e.g., 'bitcoin'), used as Holding ID
  symbol: string;
  name: string; // This is the Display Name (e.g., 'Bitcoin')
  priceUsd?: number; // Add price (optional as it might be missing)
  image?: string; // Make image optional as it might not always be present
}

export default function HoldingForm({
  initialData,
  onSuccess,
  onCancel,
}: HoldingFormProps) {
  const { holdings } = usePortfolioStore();
  const addHoldingMutation = useAddHoldingMutation();
  const updateHoldingMutation = useUpdateHoldingMutation();

  // Fetch the list of available cryptocurrencies
  const {
    data: cryptoList = [],
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
  } = useCryptoList();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoListData | null>(
    () => {
      // Find selected crypto based on initialData.id matching cryptoList item id
      if (
        !initialData ||
        !initialData.id ||
        !Array.isArray(cryptoList) ||
        cryptoList.length === 0
      )
        return null;
      // Assuming cryptoList items match the updated CryptoListData structure
      return cryptoList.find((c) => c.id === initialData.id) || null;
    },
  );

  // Ref to track the previous initialData ID
  const prevInitialDataIdRef = useRef<string | undefined>(initialData?.id);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Value for the select dropdown is the API ID (holding ID)
      cryptoApiId: initialData?.id ?? selectedCrypto?.id ?? "",
      quantity: initialData ? String(initialData.quantity) : "",
    },
  });

  const { handleSubmit, control, watch } = form;

  // Watch quantity for calculating indicative value
  const watchedQuantity = watch("quantity");

  // Recalculate selected crypto and reset form ONLY when initialData ID changes or switching modes
  useEffect(() => {
    /**
     * This effect manages the form state when the `initialData` prop changes,
     * which primarily happens when switching between adding a new holding (initialData is undefined)
     * and editing an existing one (initialData is provided), or when the specific holding being edited changes.
     *
     * Key Logic:
     * - It compares the current `initialData.id` with the ID from the previous render (stored in `prevInitialDataIdRef`).
     * - It only proceeds with resetting the form or updating the selected crypto if the `cryptoList` data is available.
     * - If the ID *has changed* (or switching between add/edit modes):
     *    - If `initialData` is now present (Edit mode), it finds the corresponding crypto in the list,
     *      updates the `selectedCrypto` state, and resets the form fields (`cryptoApiId`, `quantity`) with the `initialData` values.
     *    - If `initialData` is now absent (Add mode), it clears `selectedCrypto` and resets the form fields to empty.
     * - If the ID *has not changed*:
     *    - It might still update `selectedCrypto` if the underlying `cryptoList` data (like price) has refreshed,
     *      but crucially, it *does not reset the form fields* to avoid overwriting user input while they might be editing.
     * - Finally, it updates the `prevInitialDataIdRef` for the next render cycle.
     *
     * Dependencies: `initialData`, `cryptoList`, `form.reset` - Ensures the effect runs when the holding to edit changes,
     * the list of available cryptos loads/changes, or the reset function reference changes (though less likely).
     */
    const currentInitialId = initialData?.id;
    const previousInitialId = prevInitialDataIdRef.current;
    const listIsReady = Array.isArray(cryptoList) && cryptoList.length > 0;

    // Reset only if the ID changed (or switching modes) AND the list is ready
    if (currentInitialId !== previousInitialId && listIsReady) {
      if (currentInitialId) {
        // --- Switching to or Changing Edit Mode ---
        // Assuming cryptoList items match the updated CryptoListData structure
        const found = cryptoList.find((c) => c.id === currentInitialId);
        setSelectedCrypto(found || null);
        form.reset({
          cryptoApiId: found?.id ?? "",
          quantity: String(initialData?.quantity ?? ""),
        });
      } else {
        // --- Switching to Add Mode ---
        setSelectedCrypto(null);
        form.reset({ cryptoApiId: "", quantity: "" });
      }
    } else if (currentInitialId === previousInitialId && listIsReady) {
      // ID is the same, potentially a list update or other re-render.
      // Re-find selectedCrypto in case list data updated (e.g., price)
      // but DO NOT reset the form fields if the ID is the same.
      if (currentInitialId) {
        // Assuming cryptoList items match the updated CryptoListData structure
        const found = cryptoList.find((c) => c.id === currentInitialId);
        setSelectedCrypto(found || null);
      }
    }

    // Update the ref *after* the effect's logic
    prevInitialDataIdRef.current = currentInitialId;

    // Removed form from dependencies as we only reset on ID change
    // Added form.reset to dependencies
  }, [initialData, cryptoList, form.reset]);

  // Get existing holding *IDs* (API IDs like 'bitcoin') to prevent duplicates
  const existingHoldingIds = holdings
    .filter((h) => initialData?.id !== h.id) // Filter out the current holding if editing
    .map((h) => h.id);

  const onSubmit = async (values: FormValues) => {
    // Find the selected crypto using the apiId from the form values
    // Assuming cryptoList items match the updated CryptoListData structure
    const selected: CryptoListData | undefined = cryptoList.find(
      (c) => c.id === values.cryptoApiId,
    );
    if (!selected) {
      console.error("Selected cryptocurrency not found in the list");
      return;
    }

    // This object contains the data to be saved/updated, using API ID as the primary ID
    const holdingDataForSave = {
      // ID is set by the mutation based on apiId for add, or passed directly for update
      name: selected.name, // Display Name
      symbol: selected.symbol,
      quantity: Number.parseFloat(values.quantity),
      purchasePrice: 0, // Placeholder value - Consider if price should be fetched/passed differently
      image: selected.image, // Optional image URL
    };

    // Data specifically for the add mutation, which requires the apiId
    const addMutationData = {
      apiId: selected.id, // The stable ID like 'tether'
      ...holdingDataForSave,
    };

    try {
      if (initialData) {
        await updateHoldingMutation.mutateAsync({
          id: initialData.id,
          updates: holdingDataForSave,
        });
      } else {
        // Pass the specific structure needed by the add mutation
        await addHoldingMutation.mutateAsync(addMutationData);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving holding:", error);
    }
  };

  const handleCryptoSelect = (apiId: string) => {
    const found = cryptoList.find((c) => c.id === apiId);
    setSelectedCrypto(found || null);
  };

  const isSubmitting =
    addHoldingMutation.isPending || updateHoldingMutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        aria-label={initialData ? "Edit holding form" : "Add new holding form"}
      >
        <FormField
          control={control}
          name="cryptoApiId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel id="crypto-select-label">
                Select Cryptocurrency
              </FormLabel>
              {isLoadingList && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading crypto list...</span>
                </div>
              )}
              {isListError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Error loading crypto list.
                </p>
              )}
              {!isLoadingList && !isListError && cryptoList.length > 0 && (
                <Select
                  disabled={isSubmitting || !!initialData || isLoadingList}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCryptoSelect(value);
                  }}
                  value={field.value}
                  aria-labelledby="crypto-select-label"
                  aria-describedby="crypto-select-description crypto-select-error"
                >
                  <FormControl>
                    <SelectTrigger
                      className="h-14"
                      aria-invalid={fieldState.invalid}
                      aria-errormessage="crypto-select-error"
                    >
                      <SelectValue placeholder="Select a coin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cryptoList.map((crypto: CryptoListData) => {
                      // Check if a holding with this crypto's *ID* (API ID) already exists
                      const isExisting = existingHoldingIds.includes(crypto.id);

                      return (
                        <SelectItem
                          key={crypto.id}
                          value={crypto.id}
                          // Disable if ID exists in holdings AND we are adding a new holding (not editing)
                          disabled={isExisting && !initialData}
                          className="py-3"
                          aria-label={`${crypto.name} (${crypto.symbol}) - ${isExisting && !initialData ? " - Already in portfolio" : ""}`}
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2">
                              {crypto.image && (
                                <img
                                  src={crypto.image}
                                  alt={`${crypto.name} logo`}
                                  className="w-6 h-6 rounded-full"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {crypto.name /* Display Name */}
                                </span>
                                {/* Display price if available */}
                                {typeof crypto.priceUsd === "number" && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatCurrency(crypto.priceUsd)}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isExisting && !initialData && (
                              <output
                                className="text-xs text-destructive flex-shrink-0 ml-auto"
                                aria-live="polite"
                              >
                                Already in portfolio
                              </output>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
              <FormMessage id="crypto-select-error" />
              <p
                id="crypto-select-description"
                className="text-sm text-muted-foreground"
              >
                Select the cryptocurrency you want to add or edit.
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="quantity"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 0.5"
                  {...field}
                  step="any"
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                  aria-errormessage="quantity-error"
                />
              </FormControl>
              <FormMessage id="quantity-error" />
            </FormItem>
          )}
        />

        {/* Conditionally display estimated value section */}
        {selectedCrypto && (
          <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
            <div className="flex justify-between">
              <span>Estimated Value:</span>
              {(() => {
                const quantityNum = Number.parseFloat(watchedQuantity || "0");
                const price = selectedCrypto?.priceUsd ?? 0;
                const calculatedTotal = !Number.isNaN(quantityNum)
                  ? price * quantityNum
                  : 0;
                return (
                  <span className="font-medium">
                    {formatCurrency(calculatedTotal)}
                  </span>
                );
              })()}
            </div>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Based on current price:{" "}
              {formatCurrency(selectedCrypto.priceUsd ?? 0)} /{" "}
              {selectedCrypto.symbol}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            {initialData ? "Update Holding" : "Add Holding"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
